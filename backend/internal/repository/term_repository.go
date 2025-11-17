package repository

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"clarityconnect/internal/models"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"clarityconnect/pkg/database"
)

type TermRepository struct{}

func NewTermRepository() *TermRepository {
	return &TermRepository{}
}

// CreateTerm creates a new term
func (r *TermRepository) CreateTerm(ctx context.Context, req models.CreateTermRequest, userID *uuid.UUID) (*models.Term, error) {
	term := &models.Term{
		ID:                 uuid.New(),
		Term:               req.Term,
		BaseDefinition:     req.BaseDefinition,
		Category:           req.Category,
		CodeName:           req.CodeName,
		Tags:               req.Tags,
		ComplianceFrameworks: req.ComplianceFrameworks,
		CreatedBy:          userID,
		CreatedAt:          time.Now(),
		UpdatedAt:          time.Now(),
	}

	query := `
		INSERT INTO terms (id, term, base_definition, category, code_name, tags, compliance_frameworks, created_by, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id, term, base_definition, category, code_name, tags, compliance_frameworks, created_by, created_at, updated_at, updated_by
	`

	err := database.DB.QueryRow(ctx, query,
		term.ID, term.Term, term.BaseDefinition, term.Category, term.CodeName, term.Tags, term.ComplianceFrameworks, term.CreatedBy, term.CreatedAt, term.UpdatedAt,
	).Scan(
		&term.ID, &term.Term, &term.BaseDefinition, &term.Category, &term.CodeName, &term.Tags, &term.ComplianceFrameworks, &term.CreatedBy, &term.CreatedAt, &term.UpdatedAt, &term.UpdatedBy,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to create term: %w", err)
	}

	return term, nil
}

// GetTermByID retrieves a term by ID with related data
func (r *TermRepository) GetTermByID(ctx context.Context, id uuid.UUID) (*models.Term, error) {
	term := &models.Term{}

	query := `
		SELECT id, term, base_definition, category, code_name, tags, compliance_frameworks, visibility_type, allowed_departments, created_by, created_at, updated_at, updated_by
		FROM terms
		WHERE id = $1
	`

	err := database.DB.QueryRow(ctx, query, id).Scan(
		&term.ID, &term.Term, &term.BaseDefinition, &term.Category, &term.CodeName, &term.Tags, &term.ComplianceFrameworks, &term.VisibilityType, &term.AllowedDepartments, &term.CreatedBy, &term.CreatedAt, &term.UpdatedAt, &term.UpdatedBy,
	)

	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("term not found")
		}
		return nil, fmt.Errorf("failed to get term: %w", err)
	}

	// Load related data
	term.Contexts, _ = r.GetContextsByTermID(ctx, id)
	term.Examples, _ = r.GetExamplesByTermID(ctx, id)
	term.Relationships, _ = r.GetRelationshipsByTermID(ctx, id)

	return term, nil
}

// ListTerms retrieves a list of terms with pagination and optional department filtering
func (r *TermRepository) ListTerms(ctx context.Context, limit, offset int, category *string, userDepartment *string) ([]models.Term, int, error) {
	var terms []models.Term
	var total int

	// Build query
	baseQuery := "FROM terms WHERE 1=1"
	args := []interface{}{}
	argPos := 1

	if category != nil {
		baseQuery += fmt.Sprintf(" AND category = $%d", argPos)
		args = append(args, *category)
		argPos++
	}

	// Apply department-based filtering if user department is provided
	if userDepartment != nil && *userDepartment != "" {
		// Terms are visible if:
		// 1. visibility_type is 'public' (or NULL, defaulting to public)
		// 2. visibility_type is 'department_restricted' AND user's department is in allowed_departments
		// 3. Term has contexts matching user's department (checked separately after loading contexts)
		baseQuery += fmt.Sprintf(` AND (
			COALESCE(visibility_type, 'public') = 'public' OR
			(visibility_type = 'department_restricted' AND $%d = ANY(allowed_departments))
		)`, argPos)
		args = append(args, *userDepartment)
		argPos++
	}

	// Get total count
	countQuery := "SELECT COUNT(*) " + baseQuery
	err := database.DB.QueryRow(ctx, countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count terms: %w", err)
	}

	// Get terms
	query := `
		SELECT id, term, base_definition, category, code_name, tags, compliance_frameworks, visibility_type, allowed_departments, created_by, created_at, updated_at, updated_by
		` + baseQuery + `
		ORDER BY created_at DESC
		LIMIT $` + fmt.Sprintf("%d", argPos) + ` OFFSET $` + fmt.Sprintf("%d", argPos+1)

	args = append(args, limit, offset)
	rows, err := database.DB.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to list terms: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var term models.Term
		err := rows.Scan(
			&term.ID, &term.Term, &term.BaseDefinition, &term.Category, &term.CodeName, &term.Tags, &term.ComplianceFrameworks, &term.VisibilityType, &term.AllowedDepartments, &term.CreatedBy, &term.CreatedAt, &term.UpdatedAt, &term.UpdatedBy,
		)
		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan term: %w", err)
		}
		
		// Load contexts to check for department match (additional filtering)
		contexts, _ := r.GetContextsByTermID(ctx, term.ID)
		term.Contexts = contexts
		
		// If user department is provided, also check if term has contexts matching department
		// This allows public terms with relevant contexts to be shown
		if userDepartment != nil && *userDepartment != "" {
			// Check if term has contexts matching user's department
			hasMatchingContext := false
			for _, ctx := range contexts {
				if ctx.Cluster != nil && *ctx.Cluster == *userDepartment {
					hasMatchingContext = true
					break
				}
			}
			
			// If term is public (or NULL) and has matching context, include it
			// If term is department_restricted, it's already filtered by SQL
			// If term is public but has no matching context, still include it (public means visible to all)
			// Only skip if it's department_restricted and doesn't match (already handled by SQL)
		}
		
		terms = append(terms, term)
	}

	return terms, total, nil
}

// UpdateTerm updates an existing term
func (r *TermRepository) UpdateTerm(ctx context.Context, id uuid.UUID, req models.UpdateTermRequest, userID *uuid.UUID) (*models.Term, error) {
	// Build dynamic update query
	updates := []string{}
	args := []interface{}{}
	argPos := 1

	if req.Term != nil {
		updates = append(updates, fmt.Sprintf("term = $%d", argPos))
		args = append(args, *req.Term)
		argPos++
	}

	if req.BaseDefinition != nil {
		updates = append(updates, fmt.Sprintf("base_definition = $%d", argPos))
		args = append(args, *req.BaseDefinition)
		argPos++
	}

	if req.Category != nil {
		updates = append(updates, fmt.Sprintf("category = $%d", argPos))
		args = append(args, *req.Category)
		argPos++
	}

	if req.CodeName != nil {
		updates = append(updates, fmt.Sprintf("code_name = $%d", argPos))
		args = append(args, *req.CodeName)
		argPos++
	}

	if req.Tags != nil {
		updates = append(updates, fmt.Sprintf("tags = $%d", argPos))
		args = append(args, req.Tags)
		argPos++
	}

	if req.ComplianceFrameworks != nil {
		updates = append(updates, fmt.Sprintf("compliance_frameworks = $%d", argPos))
		args = append(args, req.ComplianceFrameworks)
		argPos++
	}

	if len(updates) == 0 {
		return r.GetTermByID(ctx, id)
	}

	updates = append(updates, fmt.Sprintf("updated_at = $%d", argPos))
	args = append(args, time.Now())
	argPos++

	if userID != nil {
		updates = append(updates, fmt.Sprintf("updated_by = $%d", argPos))
		args = append(args, *userID)
		argPos++
	}

	args = append(args, id)

	// Build the SET clause
	setClause := ""
	for i, update := range updates {
		if i > 0 {
			setClause += ", "
		}
		setClause += update
	}

	query := fmt.Sprintf(`
		UPDATE terms
		SET %s
		WHERE id = $%d
		RETURNING id, term, base_definition, category, code_name, tags, compliance_frameworks, created_by, created_at, updated_at, updated_by
	`, setClause, argPos)

	term := &models.Term{}
	err := database.DB.QueryRow(ctx, query, args...).Scan(
		&term.ID, &term.Term, &term.BaseDefinition, &term.Category, &term.CodeName, &term.Tags, &term.ComplianceFrameworks, &term.CreatedBy, &term.CreatedAt, &term.UpdatedAt, &term.UpdatedBy,
	)

	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("term not found")
		}
		return nil, fmt.Errorf("failed to update term: %w", err)
	}

	return term, nil
}

// DeleteTerm deletes a term
func (r *TermRepository) DeleteTerm(ctx context.Context, id uuid.UUID) error {
	query := `DELETE FROM terms WHERE id = $1`
	result, err := database.DB.Exec(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete term: %w", err)
	}

	if result.RowsAffected() == 0 {
		return fmt.Errorf("term not found")
	}

	return nil
}

// GetContextsByTermID retrieves all contexts for a term
func (r *TermRepository) GetContextsByTermID(ctx context.Context, termID uuid.UUID) ([]models.TermContext, error) {
	query := `
		SELECT id, term_id, cluster, system, product, context_definition, business_rules, compliance_required, created_by, created_at, updated_at, updated_by
		FROM term_contexts
		WHERE term_id = $1
		ORDER BY created_at DESC
	`

	rows, err := database.DB.Query(ctx, query, termID)
	if err != nil {
		return nil, fmt.Errorf("failed to get contexts: %w", err)
	}
	defer rows.Close()

	var contexts []models.TermContext
	for rows.Next() {
		var ctx models.TermContext
		err := rows.Scan(
			&ctx.ID, &ctx.TermID, &ctx.Cluster, &ctx.System, &ctx.Product, &ctx.ContextDefinition, &ctx.BusinessRules, &ctx.ComplianceRequired, &ctx.CreatedBy, &ctx.CreatedAt, &ctx.UpdatedAt, &ctx.UpdatedBy,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan context: %w", err)
		}
		contexts = append(contexts, ctx)
	}

	return contexts, nil
}

// CreateContext creates a new term context
func (r *TermRepository) CreateContext(ctx context.Context, termID uuid.UUID, req models.CreateContextRequest, userID *uuid.UUID) (*models.TermContext, error) {
	complianceRequired := false
	if req.ComplianceRequired != nil {
		complianceRequired = *req.ComplianceRequired
	}

	context := &models.TermContext{
		ID:                uuid.New(),
		TermID:            termID,
		Cluster:           req.Cluster,
		System:            req.System,
		Product:           req.Product,
		ContextDefinition: req.ContextDefinition,
		BusinessRules:     req.BusinessRules,
		ComplianceRequired: complianceRequired,
		CreatedBy:         userID,
		CreatedAt:         time.Now(),
		UpdatedAt:         time.Now(),
	}

	query := `
		INSERT INTO term_contexts (id, term_id, cluster, system, product, context_definition, business_rules, compliance_required, created_by, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		RETURNING id, term_id, cluster, system, product, context_definition, business_rules, compliance_required, created_by, created_at, updated_at, updated_by
	`

	err := database.DB.QueryRow(ctx, query,
		context.ID, context.TermID, context.Cluster, context.System, context.Product, context.ContextDefinition, context.BusinessRules, context.ComplianceRequired, context.CreatedBy, context.CreatedAt, context.UpdatedAt,
	).Scan(
		&context.ID, &context.TermID, &context.Cluster, &context.System, &context.Product, &context.ContextDefinition, &context.BusinessRules, &context.ComplianceRequired, &context.CreatedBy, &context.CreatedAt, &context.UpdatedAt, &context.UpdatedBy,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to create context: %w", err)
	}

	return context, nil
}

// GetExamplesByTermID retrieves all examples for a term
func (r *TermRepository) GetExamplesByTermID(ctx context.Context, termID uuid.UUID) ([]models.TermExample, error) {
	query := `
		SELECT id, term_id, context_id, example_text, source, created_by, created_at
		FROM term_examples
		WHERE term_id = $1
		ORDER BY created_at DESC
	`

	rows, err := database.DB.Query(ctx, query, termID)
	if err != nil {
		return nil, fmt.Errorf("failed to get examples: %w", err)
	}
	defer rows.Close()

	var examples []models.TermExample
	for rows.Next() {
		var ex models.TermExample
		err := rows.Scan(
			&ex.ID, &ex.TermID, &ex.ContextID, &ex.ExampleText, &ex.Source, &ex.CreatedBy, &ex.CreatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan example: %w", err)
		}
		examples = append(examples, ex)
	}

	return examples, nil
}

// CreateExample creates a new term example
func (r *TermRepository) CreateExample(ctx context.Context, termID uuid.UUID, req models.CreateExampleRequest, userID *uuid.UUID) (*models.TermExample, error) {
	example := &models.TermExample{
		ID:          uuid.New(),
		TermID:      termID,
		ContextID:   req.ContextID,
		ExampleText: req.ExampleText,
		Source:      req.Source,
		CreatedBy:   userID,
		CreatedAt:   time.Now(),
	}

	query := `
		INSERT INTO term_examples (id, term_id, context_id, example_text, source, created_by, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, term_id, context_id, example_text, source, created_by, created_at
	`

	err := database.DB.QueryRow(ctx, query,
		example.ID, example.TermID, example.ContextID, example.ExampleText, example.Source, example.CreatedBy, example.CreatedAt,
	).Scan(
		&example.ID, &example.TermID, &example.ContextID, &example.ExampleText, &example.Source, &example.CreatedBy, &example.CreatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to create example: %w", err)
	}

	return example, nil
}

// GetRelationshipsByTermID retrieves all relationships for a term
func (r *TermRepository) GetRelationshipsByTermID(ctx context.Context, termID uuid.UUID) ([]models.TermRelationship, error) {
	query := `
		SELECT tr.id, tr.term_id, tr.related_term_id, tr.relationship_type, tr.created_by, tr.created_at,
		       t.id, t.term, t.base_definition, t.category
		FROM term_relationships tr
		LEFT JOIN terms t ON tr.related_term_id = t.id
		WHERE tr.term_id = $1
		ORDER BY tr.created_at DESC
	`

	rows, err := database.DB.Query(ctx, query, termID)
	if err != nil {
		return nil, fmt.Errorf("failed to get relationships: %w", err)
	}
	defer rows.Close()

	var relationships []models.TermRelationship
	for rows.Next() {
		var rel models.TermRelationship
		var relatedTerm models.Term
		rel.RelatedTerm = &relatedTerm

		err := rows.Scan(
			&rel.ID, &rel.TermID, &rel.RelatedTermID, &rel.RelationshipType, &rel.CreatedBy, &rel.CreatedAt,
			&relatedTerm.ID, &relatedTerm.Term, &relatedTerm.BaseDefinition, &relatedTerm.Category,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan relationship: %w", err)
		}
		relationships = append(relationships, rel)
	}

	return relationships, nil
}

// CreateRelationship creates a new term relationship
func (r *TermRepository) CreateRelationship(ctx context.Context, termID uuid.UUID, req models.CreateRelationshipRequest, userID *uuid.UUID) (*models.TermRelationship, error) {
	relationship := &models.TermRelationship{
		ID:              uuid.New(),
		TermID:          termID,
		RelatedTermID:   req.RelatedTermID,
		RelationshipType: req.RelationshipType,
		CreatedBy:       userID,
		CreatedAt:       time.Now(),
	}

	query := `
		INSERT INTO term_relationships (id, term_id, related_term_id, relationship_type, created_by, created_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		ON CONFLICT (term_id, related_term_id, relationship_type) DO NOTHING
		RETURNING id, term_id, related_term_id, relationship_type, created_by, created_at
	`

	err := database.DB.QueryRow(ctx, query,
		relationship.ID, relationship.TermID, relationship.RelatedTermID, relationship.RelationshipType, relationship.CreatedBy, relationship.CreatedAt,
	).Scan(
		&relationship.ID, &relationship.TermID, &relationship.RelatedTermID, &relationship.RelationshipType, &relationship.CreatedBy, &relationship.CreatedAt,
	)

	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("relationship already exists")
		}
		return nil, fmt.Errorf("failed to create relationship: %w", err)
	}

	return relationship, nil
}

// SearchTerms performs full-text search on terms
func (r *TermRepository) SearchTerms(ctx context.Context, req models.SearchRequest) ([]models.Term, int, error) {
	var terms []models.Term
	var total int

	// Build search query
	baseQuery := `
		FROM terms
		WHERE to_tsvector('english', term || ' ' || COALESCE(base_definition, '')) @@ plainto_tsquery('english', $1)
	`
	args := []interface{}{req.Query}
	argPos := 2

	if req.Category != nil {
		baseQuery += fmt.Sprintf(" AND category = $%d", argPos)
		args = append(args, *req.Category)
		argPos++
	}

	if len(req.Tags) > 0 {
		baseQuery += fmt.Sprintf(" AND tags && $%d", argPos)
		args = append(args, req.Tags)
		argPos++
	}

	// Get total count
	countQuery := "SELECT COUNT(*) " + baseQuery
	err := database.DB.QueryRow(ctx, countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count search results: %w", err)
	}

	// Get terms with ranking
	query := `
		SELECT id, term, base_definition, category, code_name, tags, created_by, created_at, updated_at, updated_by,
		       ts_rank(to_tsvector('english', term || ' ' || COALESCE(base_definition, '')), plainto_tsquery('english', $1)) as rank
		` + baseQuery + `
		ORDER BY rank DESC, created_at DESC
		LIMIT $` + fmt.Sprintf("%d", argPos) + ` OFFSET $` + fmt.Sprintf("%d", argPos+1)

	if req.Limit == 0 {
		req.Limit = 20
	}
	args = append(args, req.Limit, req.Offset)

	rows, err := database.DB.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to search terms: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var term models.Term
		var rank float64
		err := rows.Scan(
			&term.ID, &term.Term, &term.BaseDefinition, &term.Category, &term.CodeName, &term.Tags, &term.CreatedBy, &term.CreatedAt, &term.UpdatedAt, &term.UpdatedBy, &rank,
		)
		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan term: %w", err)
		}
		terms = append(terms, term)
	}

	return terms, total, nil
}

// SearchTermsWithContext performs search including context filtering
func (r *TermRepository) SearchTermsWithContext(ctx context.Context, req models.SearchRequest) ([]models.Term, int, error) {
	var terms []models.Term
	var total int

	// Build search query with context join
	baseQuery := `
		FROM terms t
		LEFT JOIN term_contexts tc ON t.id = tc.term_id
		WHERE (
			to_tsvector('english', t.term || ' ' || COALESCE(t.base_definition, '')) @@ plainto_tsquery('english', $1)
			OR to_tsvector('english', COALESCE(tc.context_definition, '')) @@ plainto_tsquery('english', $1)
		)
	`
	args := []interface{}{req.Query}
	argPos := 2

	if req.Category != nil {
		baseQuery += fmt.Sprintf(" AND t.category = $%d", argPos)
		args = append(args, *req.Category)
		argPos++
	}

	if req.Cluster != nil {
		baseQuery += fmt.Sprintf(" AND tc.cluster = $%d", argPos)
		args = append(args, *req.Cluster)
		argPos++
	}

	if req.System != nil {
		baseQuery += fmt.Sprintf(" AND tc.system = $%d", argPos)
		args = append(args, *req.System)
		argPos++
	}

	if len(req.Tags) > 0 {
		baseQuery += fmt.Sprintf(" AND t.tags && $%d", argPos)
		args = append(args, req.Tags)
		argPos++
	}

	// Get total count (distinct terms)
	countQuery := "SELECT COUNT(DISTINCT t.id) " + baseQuery
	err := database.DB.QueryRow(ctx, countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count search results: %w", err)
	}

	// Get distinct terms
	query := `
		SELECT DISTINCT ON (t.id) t.id, t.term, t.base_definition, t.category, t.code_name, t.tags, t.created_by, t.created_at, t.updated_at, t.updated_by
		` + baseQuery + `
		ORDER BY t.id, t.created_at DESC
		LIMIT $` + fmt.Sprintf("%d", argPos) + ` OFFSET $` + fmt.Sprintf("%d", argPos+1)

	if req.Limit == 0 {
		req.Limit = 20
	}
	args = append(args, req.Limit, req.Offset)

	rows, err := database.DB.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to search terms: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var term models.Term
		err := rows.Scan(
			&term.ID, &term.Term, &term.BaseDefinition, &term.Category, &term.CodeName, &term.Tags, &term.CreatedBy, &term.CreatedAt, &term.UpdatedAt, &term.UpdatedBy,
		)
		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan term: %w", err)
		}
		terms = append(terms, term)
	}

	return terms, total, nil
}

