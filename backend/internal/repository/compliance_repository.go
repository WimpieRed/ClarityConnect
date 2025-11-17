package repository

import (
	"context"
	"fmt"

	"clarityconnect/internal/models"

	"github.com/jackc/pgx/v5"
	"clarityconnect/pkg/database"
)

type ComplianceRepository struct{}

func NewComplianceRepository() *ComplianceRepository {
	return &ComplianceRepository{}
}

// GetComplianceTerms retrieves terms for a specific compliance framework
func (r *ComplianceRepository) GetComplianceTerms(ctx context.Context, framework string) ([]models.Term, error) {
	query := `
		SELECT id, term, base_definition, category, code_name, tags, compliance_frameworks, created_by, created_at, updated_at, updated_by
		FROM terms
		WHERE $1 = ANY(compliance_frameworks)
		ORDER BY term ASC
	`

	rows, err := database.DB.Query(ctx, query, framework)
	if err != nil {
		return nil, fmt.Errorf("failed to get compliance terms: %w", err)
	}
	defer rows.Close()

	var terms []models.Term
	for rows.Next() {
		var term models.Term
		err := rows.Scan(
			&term.ID, &term.Term, &term.BaseDefinition, &term.Category, &term.CodeName, &term.Tags, &term.ComplianceFrameworks, &term.CreatedBy, &term.CreatedAt, &term.UpdatedAt, &term.UpdatedBy,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan term: %w", err)
		}
		terms = append(terms, term)
	}

	return terms, nil
}

// GetComplianceDashboard gets compliance metrics
func (r *ComplianceRepository) GetComplianceDashboard(ctx context.Context, framework *string) (map[string]interface{}, error) {
	var query string
	var args []interface{}

	if framework != nil {
		query = `
			SELECT 
				COUNT(DISTINCT t.id) as total_terms,
				COUNT(DISTINCT CASE WHEN tc.compliance_required = TRUE THEN tc.term_id END) as terms_with_compliance_context,
				COUNT(DISTINCT tc.cluster) as clusters_covered
			FROM terms t
			LEFT JOIN term_contexts tc ON t.id = tc.term_id
			WHERE $1 = ANY(t.compliance_frameworks)
		`
		args = []interface{}{*framework}
	} else {
		query = `
			SELECT 
				COUNT(DISTINCT t.id) as total_terms,
				COUNT(DISTINCT CASE WHEN tc.compliance_required = TRUE THEN tc.term_id END) as terms_with_compliance_context,
				COUNT(DISTINCT tc.cluster) as clusters_covered
			FROM terms t
			LEFT JOIN term_contexts tc ON t.id = tc.term_id
			WHERE t.compliance_frameworks IS NOT NULL AND array_length(t.compliance_frameworks, 1) > 0
		`
		args = []interface{}{}
	}

	var totalTerms, termsWithContext, clustersCovered int
	err := database.DB.QueryRow(ctx, query, args...).Scan(&totalTerms, &termsWithContext, &clustersCovered)
	if err != nil {
		return nil, fmt.Errorf("failed to get compliance dashboard: %w", err)
	}

	coveragePercent := float64(0)
	if totalTerms > 0 {
		coveragePercent = float64(termsWithContext) / float64(totalTerms) * 100
	}

	return map[string]interface{}{
		"total_terms":              totalTerms,
		"terms_with_compliance_context": termsWithContext,
		"clusters_covered":         clustersCovered,
		"coverage_percent":         coveragePercent,
	}, nil
}

// GetComplianceGaps gets gaps related to compliance
func (r *ComplianceRepository) GetComplianceGaps(ctx context.Context, framework *string) ([]models.GapAnalysis, error) {
	var query string
	var args []interface{}

	if framework != nil {
		query = `
			SELECT ga.id, ga.term_id, ga.gap_type, ga.affected_clusters, ga.severity, ga.description, ga.detected_at, ga.resolved_at, ga.resolved_by
			FROM gap_analyses ga
			JOIN terms t ON ga.term_id = t.id
			WHERE $1 = ANY(t.compliance_frameworks) AND ga.resolved_at IS NULL
			ORDER BY ga.severity DESC, ga.detected_at DESC
		`
		args = []interface{}{*framework}
	} else {
		query = `
			SELECT ga.id, ga.term_id, ga.gap_type, ga.affected_clusters, ga.severity, ga.description, ga.detected_at, ga.resolved_at, ga.resolved_by
			FROM gap_analyses ga
			JOIN terms t ON ga.term_id = t.id
			WHERE t.compliance_frameworks IS NOT NULL AND array_length(t.compliance_frameworks, 1) > 0 AND ga.resolved_at IS NULL
			ORDER BY ga.severity DESC, ga.detected_at DESC
		`
		args = []interface{}{}
	}

	rows, err := database.DB.Query(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to get compliance gaps: %w", err)
	}
	defer rows.Close()

	var gaps []models.GapAnalysis
	for rows.Next() {
		var gap models.GapAnalysis
		err := rows.Scan(
			&gap.ID, &gap.TermID, &gap.GapType, &gap.AffectedClusters, &gap.Severity, &gap.Description, &gap.DetectedAt, &gap.ResolvedAt, &gap.ResolvedBy,
		)
		if err != nil {
			if err == pgx.ErrNoRows {
				return gaps, nil
			}
			return nil, fmt.Errorf("failed to scan gap: %w", err)
		}
		gaps = append(gaps, gap)
	}

	return gaps, nil
}

