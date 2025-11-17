package service

import (
	"context"
	"fmt"
	"strings"
	"time"

	"clarityconnect/internal/models"
	"clarityconnect/internal/repository"

	"github.com/google/uuid"
)

type GapDetectionService struct {
	termRepo *repository.TermRepository
	gapRepo  *repository.GapRepository
}

func NewGapDetectionService() *GapDetectionService {
	return &GapDetectionService{
		termRepo: repository.NewTermRepository(),
		gapRepo:  repository.NewGapRepository(),
	}
}

// DetectGaps scans all terms and identifies gaps
func (s *GapDetectionService) DetectGaps(ctx context.Context) ([]models.GapAnalysis, error) {
	var detectedGaps []models.GapAnalysis

	// Get all clusters from contexts
	allClusters, err := s.gapRepo.GetAllClustersFromContexts(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get clusters: %w", err)
	}

	if len(allClusters) == 0 {
		return detectedGaps, nil
	}

	// Get all terms
	terms, _, err := s.termRepo.ListTerms(ctx, 10000, 0, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to list terms: %w", err)
	}

	// Detect gaps for each term
	for _, term := range terms {
		// Get contexts for this term
		contexts, err := s.termRepo.GetContextsByTermID(ctx, term.ID)
		if err != nil {
			continue
		}

		// Group contexts by cluster
		contextsByCluster := make(map[string][]models.TermContext)
		for _, ctx := range contexts {
			if ctx.Cluster != nil {
				clusterName := *ctx.Cluster
				contextsByCluster[clusterName] = append(contextsByCluster[clusterName], ctx)
			}
		}

		// Detect missing contexts
		missingContextGaps := s.detectMissingContexts(term.ID, allClusters, contextsByCluster)
		detectedGaps = append(detectedGaps, missingContextGaps...)

		// Detect conflicting definitions
		conflictGaps := s.detectConflictingDefinitions(term.ID, contextsByCluster)
		detectedGaps = append(detectedGaps, conflictGaps...)

		// Detect outdated contexts
		outdatedGaps := s.detectOutdatedContexts(term.ID, contexts)
		detectedGaps = append(detectedGaps, outdatedGaps...)
	}

	// Save detected gaps to database
	for i := range detectedGaps {
		detectedGaps[i].ID = uuid.New()
		detectedGaps[i].DetectedAt = time.Now()
		if err := s.gapRepo.CreateGap(ctx, &detectedGaps[i]); err != nil {
			// Log error but continue
			continue
		}
	}

	return detectedGaps, nil
}

// detectMissingContexts identifies terms missing contexts in certain clusters
func (s *GapDetectionService) detectMissingContexts(termID uuid.UUID, allClusters []string, contextsByCluster map[string][]models.TermContext) []models.GapAnalysis {
	var gaps []models.GapAnalysis

	// Find clusters that have contexts for this term
	clustersWithContext := make(map[string]bool)
	for cluster := range contextsByCluster {
		clustersWithContext[cluster] = true
	}

	// Find clusters missing contexts
	var missingClusters []string
	for _, cluster := range allClusters {
		if !clustersWithContext[cluster] {
			missingClusters = append(missingClusters, cluster)
		}
	}

	// If some clusters have contexts but others don't, it's a gap
	if len(missingClusters) > 0 && len(clustersWithContext) > 0 {
		severity := "medium"
		if len(missingClusters) > len(allClusters)/2 {
			severity = "high"
		}

		desc := fmt.Sprintf("Term has contexts in %d cluster(s) but is missing in %d cluster(s)", len(clustersWithContext), len(missingClusters))
		gap := models.GapAnalysis{
			TermID:          termID,
			GapType:         "missing_context",
			AffectedClusters: missingClusters,
			Severity:        severity,
			Description:     &desc,
		}
		gaps = append(gaps, gap)
	}

	return gaps
}

// detectConflictingDefinitions identifies terms with significantly different definitions across clusters
func (s *GapDetectionService) detectConflictingDefinitions(termID uuid.UUID, contextsByCluster map[string][]models.TermContext) []models.GapAnalysis {
	var gaps []models.GapAnalysis

	if len(contextsByCluster) < 2 {
		return gaps
	}

	// Compare definitions across clusters
	var conflictingClusters []string
	clusterDefinitions := make(map[string]string)

	for cluster, contexts := range contextsByCluster {
		if len(contexts) > 0 {
			// Use the most recent context definition
			clusterDefinitions[cluster] = contexts[0].ContextDefinition
		}
	}

	// Simple similarity check - if definitions are very different, flag as conflict
	clusters := make([]string, 0, len(clusterDefinitions))
	for cluster := range clusterDefinitions {
		clusters = append(clusters, cluster)
	}

	for i := 0; i < len(clusters); i++ {
		for j := i + 1; j < len(clusters); j++ {
			cluster1 := clusters[i]
			cluster2 := clusters[j]
			def1 := clusterDefinitions[cluster1]
			def2 := clusterDefinitions[cluster2]

			similarity := calculateSimilarity(def1, def2)
			// If similarity is below 0.5, consider it a conflict
			if similarity < 0.5 && len(def1) > 20 && len(def2) > 20 {
				conflictingClusters = append(conflictingClusters, cluster1, cluster2)
			}
		}
	}

	if len(conflictingClusters) > 0 {
		// Remove duplicates
		uniqueClusters := make(map[string]bool)
		for _, cluster := range conflictingClusters {
			uniqueClusters[cluster] = true
		}
		affectedClusters := make([]string, 0, len(uniqueClusters))
		for cluster := range uniqueClusters {
			affectedClusters = append(affectedClusters, cluster)
		}

		severity := "high"
		if len(affectedClusters) == 2 {
			severity = "medium"
		}

		desc := fmt.Sprintf("Term has conflicting definitions across %d cluster(s)", len(affectedClusters))
		gap := models.GapAnalysis{
			TermID:          termID,
			GapType:         "conflicting_definition",
			AffectedClusters: affectedClusters,
			Severity:        severity,
			Description:     &desc,
		}
		gaps = append(gaps, gap)
	}

	return gaps
}

// detectOutdatedContexts identifies contexts that haven't been updated in a long time
func (s *GapDetectionService) detectOutdatedContexts(termID uuid.UUID, contexts []models.TermContext) []models.GapAnalysis {
	var gaps []models.GapAnalysis

	// Consider a context outdated if it hasn't been updated in 6 months
	outdatedThreshold := time.Now().AddDate(0, -6, 0)
	var outdatedClusters []string

	for _, ctx := range contexts {
		if ctx.Cluster != nil && ctx.UpdatedAt.Before(outdatedThreshold) {
			outdatedClusters = append(outdatedClusters, *ctx.Cluster)
		}
	}

	if len(outdatedClusters) > 0 {
		// Remove duplicates
		uniqueClusters := make(map[string]bool)
		for _, cluster := range outdatedClusters {
			uniqueClusters[cluster] = true
		}
		affectedClusters := make([]string, 0, len(uniqueClusters))
		for cluster := range uniqueClusters {
			affectedClusters = append(affectedClusters, cluster)
		}

		desc := fmt.Sprintf("Term has outdated context definitions in %d cluster(s) (not updated in 6+ months)", len(affectedClusters))
		gap := models.GapAnalysis{
			TermID:          termID,
			GapType:         "outdated",
			AffectedClusters: affectedClusters,
			Severity:        "low",
			Description:     &desc,
		}
		gaps = append(gaps, gap)
	}

	return gaps
}

// calculateSimilarity calculates a simple similarity score between two strings (0-1)
func calculateSimilarity(str1, str2 string) float64 {
	if str1 == str2 {
		return 1.0
	}

	// Convert to lowercase for comparison
	s1 := strings.ToLower(str1)
	s2 := strings.ToLower(str2)

	// Simple word-based similarity
	words1 := strings.Fields(s1)
	words2 := strings.Fields(s2)

	if len(words1) == 0 && len(words2) == 0 {
		return 1.0
	}
	if len(words1) == 0 || len(words2) == 0 {
		return 0.0
	}

	// Count common words
	wordMap1 := make(map[string]int)
	for _, word := range words1 {
		wordMap1[word]++
	}

	wordMap2 := make(map[string]int)
	for _, word := range words2 {
		wordMap2[word]++
	}

	commonWords := 0
	totalWords := len(words1) + len(words2)

	for word, count1 := range wordMap1 {
		if count2, exists := wordMap2[word]; exists {
			commonWords += count1 + count2
		}
	}

	if totalWords == 0 {
		return 0.0
	}

	similarity := float64(commonWords) / float64(totalWords)
	return similarity
}

// CompareClusters compares term definitions across clusters
func (s *GapDetectionService) CompareClusters(ctx context.Context, termID uuid.UUID) (map[string][]models.TermContext, error) {
	return s.gapRepo.GetTermClusterComparison(ctx, termID)
}

