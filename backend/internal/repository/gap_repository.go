package repository

import (
	"context"
	"fmt"
	"time"

	"clarityconnect/internal/models"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"clarityconnect/pkg/database"
)

type GapRepository struct{}

func NewGapRepository() *GapRepository {
	return &GapRepository{}
}

// CreateGap creates a new gap analysis entry
func (r *GapRepository) CreateGap(ctx context.Context, gap *models.GapAnalysis) error {
	query := `
		INSERT INTO gap_analyses (id, term_id, gap_type, affected_clusters, severity, description, detected_at, resolved_at, resolved_by)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id
	`

	err := database.DB.QueryRow(ctx, query,
		gap.ID, gap.TermID, gap.GapType, gap.AffectedClusters, gap.Severity, gap.Description,
		gap.DetectedAt, gap.ResolvedAt, gap.ResolvedBy,
	).Scan(&gap.ID)

	if err != nil {
		return fmt.Errorf("failed to create gap: %w", err)
	}

	return nil
}

// GetGapByID retrieves a gap by ID
func (r *GapRepository) GetGapByID(ctx context.Context, id uuid.UUID) (*models.GapAnalysis, error) {
	gap := &models.GapAnalysis{}

	query := `
		SELECT id, term_id, gap_type, affected_clusters, severity, description, detected_at, resolved_at, resolved_by
		FROM gap_analyses
		WHERE id = $1
	`

	err := database.DB.QueryRow(ctx, query, id).Scan(
		&gap.ID, &gap.TermID, &gap.GapType, &gap.AffectedClusters, &gap.Severity,
		&gap.Description, &gap.DetectedAt, &gap.ResolvedAt, &gap.ResolvedBy,
	)

	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("gap not found")
		}
		return nil, fmt.Errorf("failed to get gap: %w", err)
	}

	return gap, nil
}

// ListGaps retrieves gaps with filters
func (r *GapRepository) ListGaps(ctx context.Context, limit, offset int, gapType *string, cluster *string, severity *string, resolved *bool) ([]models.GapAnalysis, int, error) {
	var gaps []models.GapAnalysis
	var total int

	baseQuery := "FROM gap_analyses WHERE 1=1"
	args := []interface{}{}
	argPos := 1

	if gapType != nil {
		baseQuery += fmt.Sprintf(" AND gap_type = $%d", argPos)
		args = append(args, *gapType)
		argPos++
	}

	if severity != nil {
		baseQuery += fmt.Sprintf(" AND severity = $%d", argPos)
		args = append(args, *severity)
		argPos++
	}

	if resolved != nil {
		if *resolved {
			baseQuery += fmt.Sprintf(" AND resolved_at IS NOT NULL")
		} else {
			baseQuery += fmt.Sprintf(" AND resolved_at IS NULL")
		}
	}

	if cluster != nil {
		baseQuery += fmt.Sprintf(" AND $%d = ANY(affected_clusters)", argPos)
		args = append(args, *cluster)
		argPos++
	}

	// Get total count
	countQuery := "SELECT COUNT(*) " + baseQuery
	err := database.DB.QueryRow(ctx, countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count gaps: %w", err)
	}

	// Get gaps
	query := `
		SELECT id, term_id, gap_type, affected_clusters, severity, description, detected_at, resolved_at, resolved_by
		` + baseQuery + `
		ORDER BY detected_at DESC
		LIMIT $` + fmt.Sprintf("%d", argPos) + ` OFFSET $` + fmt.Sprintf("%d", argPos+1)

	args = append(args, limit, offset)
	rows, err := database.DB.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to list gaps: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var gap models.GapAnalysis
		err := rows.Scan(
			&gap.ID, &gap.TermID, &gap.GapType, &gap.AffectedClusters, &gap.Severity,
			&gap.Description, &gap.DetectedAt, &gap.ResolvedAt, &gap.ResolvedBy,
		)
		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan gap: %w", err)
		}
		gaps = append(gaps, gap)
	}

	return gaps, total, nil
}

// ResolveGap marks a gap as resolved
func (r *GapRepository) ResolveGap(ctx context.Context, id uuid.UUID, resolvedBy *uuid.UUID) error {
	query := `
		UPDATE gap_analyses
		SET resolved_at = $1, resolved_by = $2
		WHERE id = $3
	`

	result, err := database.DB.Exec(ctx, query, time.Now(), resolvedBy, id)
	if err != nil {
		return fmt.Errorf("failed to resolve gap: %w", err)
	}

	if result.RowsAffected() == 0 {
		return fmt.Errorf("gap not found")
	}

	return nil
}

// GetClusters retrieves all clusters
func (r *GapRepository) GetClusters(ctx context.Context) ([]models.Cluster, error) {
	query := `
		SELECT id, name, description, owner_id, created_at, updated_at
		FROM clusters
		ORDER BY name ASC
	`

	rows, err := database.DB.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to get clusters: %w", err)
	}
	defer rows.Close()

	var clusters []models.Cluster
	for rows.Next() {
		var cluster models.Cluster
		err := rows.Scan(
			&cluster.ID, &cluster.Name, &cluster.Description, &cluster.OwnerID,
			&cluster.CreatedAt, &cluster.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan cluster: %w", err)
		}
		clusters = append(clusters, cluster)
	}

	return clusters, nil
}

// GetClusterByName retrieves a cluster by name
func (r *GapRepository) GetClusterByName(ctx context.Context, name string) (*models.Cluster, error) {
	cluster := &models.Cluster{}

	query := `
		SELECT id, name, description, owner_id, created_at, updated_at
		FROM clusters
		WHERE name = $1
	`

	err := database.DB.QueryRow(ctx, query, name).Scan(
		&cluster.ID, &cluster.Name, &cluster.Description, &cluster.OwnerID,
		&cluster.CreatedAt, &cluster.UpdatedAt,
	)

	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("cluster not found")
		}
		return nil, fmt.Errorf("failed to get cluster: %w", err)
	}

	return cluster, nil
}

// CreateCluster creates a new cluster
func (r *GapRepository) CreateCluster(ctx context.Context, req models.CreateClusterRequest, ownerID *uuid.UUID) (*models.Cluster, error) {
	cluster := &models.Cluster{
		ID:          uuid.New(),
		Name:        req.Name,
		Description: req.Description,
		OwnerID:     ownerID,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	query := `
		INSERT INTO clusters (id, name, description, owner_id, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, name, description, owner_id, created_at, updated_at
	`

	err := database.DB.QueryRow(ctx, query,
		cluster.ID, cluster.Name, cluster.Description, cluster.OwnerID, cluster.CreatedAt, cluster.UpdatedAt,
	).Scan(
		&cluster.ID, &cluster.Name, &cluster.Description, &cluster.OwnerID, &cluster.CreatedAt, &cluster.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to create cluster: %w", err)
	}

	return cluster, nil
}

// GetTermsByCluster retrieves all terms that have contexts for a specific cluster
func (r *GapRepository) GetTermsByCluster(ctx context.Context, clusterName string) ([]models.Term, error) {
	query := `
		SELECT DISTINCT t.id, t.term, t.base_definition, t.category, t.code_name, t.tags, t.created_by, t.created_at, t.updated_at, t.updated_by
		FROM terms t
		INNER JOIN term_contexts tc ON t.id = tc.term_id
		WHERE tc.cluster = $1
		ORDER BY t.term ASC
	`

	rows, err := database.DB.Query(ctx, query, clusterName)
	if err != nil {
		return nil, fmt.Errorf("failed to get terms by cluster: %w", err)
	}
	defer rows.Close()

	var terms []models.Term
	for rows.Next() {
		var term models.Term
		err := rows.Scan(
			&term.ID, &term.Term, &term.BaseDefinition, &term.Category, &term.CodeName, &term.Tags,
			&term.CreatedBy, &term.CreatedAt, &term.UpdatedAt, &term.UpdatedBy,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan term: %w", err)
		}
		terms = append(terms, term)
	}

	return terms, nil
}

// GetTermClusterComparison retrieves a term with all its contexts grouped by cluster
func (r *GapRepository) GetTermClusterComparison(ctx context.Context, termID uuid.UUID) (map[string][]models.TermContext, error) {
	query := `
		SELECT id, term_id, cluster, system, product, context_definition, created_by, created_at, updated_at, updated_by
		FROM term_contexts
		WHERE term_id = $1 AND cluster IS NOT NULL
		ORDER BY cluster, created_at DESC
	`

	rows, err := database.DB.Query(ctx, query, termID)
	if err != nil {
		return nil, fmt.Errorf("failed to get term cluster comparison: %w", err)
	}
	defer rows.Close()

	comparison := make(map[string][]models.TermContext)
	for rows.Next() {
		var ctx models.TermContext
		err := rows.Scan(
			&ctx.ID, &ctx.TermID, &ctx.Cluster, &ctx.System, &ctx.Product,
			&ctx.ContextDefinition, &ctx.CreatedBy, &ctx.CreatedAt, &ctx.UpdatedAt, &ctx.UpdatedBy,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan context: %w", err)
		}

		if ctx.Cluster != nil {
			clusterName := *ctx.Cluster
			comparison[clusterName] = append(comparison[clusterName], ctx)
		}
	}

	return comparison, nil
}

// GetAllClustersFromContexts retrieves all unique cluster names from term_contexts
func (r *GapRepository) GetAllClustersFromContexts(ctx context.Context) ([]string, error) {
	query := `
		SELECT DISTINCT cluster
		FROM term_contexts
		WHERE cluster IS NOT NULL
		ORDER BY cluster ASC
	`

	rows, err := database.DB.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to get clusters from contexts: %w", err)
	}
	defer rows.Close()

	var clusters []string
	for rows.Next() {
		var cluster pgtype.Text
		err := rows.Scan(&cluster)
		if err != nil {
			return nil, fmt.Errorf("failed to scan cluster: %w", err)
		}
		if cluster.Valid {
			clusters = append(clusters, cluster.String)
		}
	}

	return clusters, nil
}

// GetGapAnalytics retrieves gap statistics
func (r *GapRepository) GetGapAnalytics(ctx context.Context) (map[string]interface{}, error) {
	analytics := make(map[string]interface{})

	// Total gaps
	var totalGaps int
	err := database.DB.QueryRow(ctx, "SELECT COUNT(*) FROM gap_analyses WHERE resolved_at IS NULL").Scan(&totalGaps)
	if err != nil {
		return nil, fmt.Errorf("failed to count total gaps: %w", err)
	}
	analytics["total_gaps"] = totalGaps

	// Gaps by type
	typeQuery := `
		SELECT gap_type, COUNT(*) 
		FROM gap_analyses 
		WHERE resolved_at IS NULL 
		GROUP BY gap_type
	`
	rows, err := database.DB.Query(ctx, typeQuery)
	if err != nil {
		return nil, fmt.Errorf("failed to get gaps by type: %w", err)
	}
	defer rows.Close()

	gapsByType := make(map[string]int)
	for rows.Next() {
		var gapType string
		var count int
		err := rows.Scan(&gapType, &count)
		if err != nil {
			return nil, fmt.Errorf("failed to scan gap type: %w", err)
		}
		gapsByType[gapType] = count
	}
	analytics["gaps_by_type"] = gapsByType

	// Gaps by severity
	severityQuery := `
		SELECT severity, COUNT(*) 
		FROM gap_analyses 
		WHERE resolved_at IS NULL 
		GROUP BY severity
	`
	rows2, err := database.DB.Query(ctx, severityQuery)
	if err != nil {
		return nil, fmt.Errorf("failed to get gaps by severity: %w", err)
	}
	defer rows2.Close()

	gapsBySeverity := make(map[string]int)
	for rows2.Next() {
		var severity string
		var count int
		err := rows2.Scan(&severity, &count)
		if err != nil {
			return nil, fmt.Errorf("failed to scan gap severity: %w", err)
		}
		gapsBySeverity[severity] = count
	}
	analytics["gaps_by_severity"] = gapsBySeverity

	// Resolved gaps count
	var resolvedGaps int
	err = database.DB.QueryRow(ctx, "SELECT COUNT(*) FROM gap_analyses WHERE resolved_at IS NOT NULL").Scan(&resolvedGaps)
	if err != nil {
		return nil, fmt.Errorf("failed to count resolved gaps: %w", err)
	}
	analytics["resolved_gaps"] = resolvedGaps

	return analytics, nil
}

// GetClusterCoverage retrieves coverage metrics per cluster
func (r *GapRepository) GetClusterCoverage(ctx context.Context) (map[string]interface{}, error) {
	// Get all clusters
	clusters, err := r.GetAllClustersFromContexts(ctx)
	if err != nil {
		return nil, err
	}

	coverage := make(map[string]interface{})
	clusterStats := make([]map[string]interface{}, 0)

	// Get total terms
	var totalTerms int
	err = database.DB.QueryRow(ctx, "SELECT COUNT(*) FROM terms").Scan(&totalTerms)
	if err != nil {
		return nil, fmt.Errorf("failed to count total terms: %w", err)
	}

	for _, clusterName := range clusters {
		// Count terms with contexts for this cluster
		var termsWithContext int
		err := database.DB.QueryRow(ctx,
			"SELECT COUNT(DISTINCT term_id) FROM term_contexts WHERE cluster = $1",
			clusterName,
		).Scan(&termsWithContext)

		if err != nil {
			continue
		}

		// Count gaps for this cluster
		var gapsCount int
		err = database.DB.QueryRow(ctx,
			"SELECT COUNT(*) FROM gap_analyses WHERE $1 = ANY(affected_clusters) AND resolved_at IS NULL",
			clusterName,
		).Scan(&gapsCount)

		if err != nil {
			gapsCount = 0
		}

		coveragePercent := 0.0
		if totalTerms > 0 {
			coveragePercent = float64(termsWithContext) / float64(totalTerms) * 100
		}

		clusterStats = append(clusterStats, map[string]interface{}{
			"cluster":          clusterName,
			"terms_with_context": termsWithContext,
			"total_terms":      totalTerms,
			"coverage_percent": coveragePercent,
			"gaps_count":       gapsCount,
		})
	}

	coverage["clusters"] = clusterStats
	coverage["total_terms"] = totalTerms

	return coverage, nil
}

