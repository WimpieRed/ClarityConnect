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

type GovernanceRepository struct{}

func NewGovernanceRepository() *GovernanceRepository {
	return &GovernanceRepository{}
}

// CreateProposal creates a new term proposal
func (r *GovernanceRepository) CreateProposal(ctx context.Context, req models.CreateProposalRequest, userID *uuid.UUID) (*models.TermProposal, error) {
	proposal := &models.TermProposal{
		ID:           uuid.New(),
		TermID:       req.TermID,
		ProposalType: req.ProposalType,
		ProposedData: req.ProposedData,
		Reason:       req.Reason,
		Status:       "pending",
		ProposedBy:   userID,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	// Convert ProposedData to JSONB
	proposedDataJSON, err := json.Marshal(req.ProposedData)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal proposed data: %w", err)
	}

	query := `
		INSERT INTO term_proposals (id, term_id, proposal_type, proposed_data, reason, status, proposed_by, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id, term_id, proposal_type, proposed_data, reason, status, proposed_by, reviewed_by, reviewed_at, created_at, updated_at
	`

	var proposedDataJSONB []byte
	err = database.DB.QueryRow(ctx, query,
		proposal.ID, proposal.TermID, proposal.ProposalType, proposedDataJSON, proposal.Reason, proposal.Status, proposal.ProposedBy, proposal.CreatedAt, proposal.UpdatedAt,
	).Scan(
		&proposal.ID, &proposal.TermID, &proposal.ProposalType, &proposedDataJSONB, &proposal.Reason, &proposal.Status, &proposal.ProposedBy, &proposal.ReviewedBy, &proposal.ReviewedAt, &proposal.CreatedAt, &proposal.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to create proposal: %w", err)
	}

	// Unmarshal the JSONB back
	if err := json.Unmarshal(proposedDataJSONB, &proposal.ProposedData); err != nil {
		return nil, fmt.Errorf("failed to unmarshal proposed data: %w", err)
	}

	return proposal, nil
}

// GetProposalByID retrieves a proposal by ID
func (r *GovernanceRepository) GetProposalByID(ctx context.Context, id uuid.UUID) (*models.TermProposal, error) {
	proposal := &models.TermProposal{}

	query := `
		SELECT id, term_id, proposal_type, proposed_data, reason, status, proposed_by, reviewed_by, reviewed_at, created_at, updated_at
		FROM term_proposals
		WHERE id = $1
	`

	var proposedDataJSONB []byte
	err := database.DB.QueryRow(ctx, query, id).Scan(
		&proposal.ID, &proposal.TermID, &proposal.ProposalType, &proposedDataJSONB, &proposal.Reason, &proposal.Status, &proposal.ProposedBy, &proposal.ReviewedBy, &proposal.ReviewedAt, &proposal.CreatedAt, &proposal.UpdatedAt,
	)

	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("proposal not found")
		}
		return nil, fmt.Errorf("failed to get proposal: %w", err)
	}

	// Unmarshal the JSONB
	if err := json.Unmarshal(proposedDataJSONB, &proposal.ProposedData); err != nil {
		return nil, fmt.Errorf("failed to unmarshal proposed data: %w", err)
	}

	return proposal, nil
}

// ListProposals retrieves a list of proposals with optional filtering
func (r *GovernanceRepository) ListProposals(ctx context.Context, status *string, limit, offset int) ([]models.TermProposal, int, error) {
	var proposals []models.TermProposal
	var total int

	baseQuery := "FROM term_proposals WHERE 1=1"
	args := []interface{}{}
	argPos := 1

	if status != nil {
		baseQuery += fmt.Sprintf(" AND status = $%d", argPos)
		args = append(args, *status)
		argPos++
	}

	// Get total count
	countQuery := "SELECT COUNT(*) " + baseQuery
	err := database.DB.QueryRow(ctx, countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count proposals: %w", err)
	}

	// Get proposals
	query := `
		SELECT id, term_id, proposal_type, proposed_data, reason, status, proposed_by, reviewed_by, reviewed_at, created_at, updated_at
		` + baseQuery + `
		ORDER BY created_at DESC
		LIMIT $` + fmt.Sprintf("%d", argPos) + ` OFFSET $` + fmt.Sprintf("%d", argPos+1)

	args = append(args, limit, offset)
	rows, err := database.DB.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to list proposals: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var proposal models.TermProposal
		var proposedDataJSONB []byte
		err := rows.Scan(
			&proposal.ID, &proposal.TermID, &proposal.ProposalType, &proposedDataJSONB, &proposal.Reason, &proposal.Status, &proposal.ProposedBy, &proposal.ReviewedBy, &proposal.ReviewedAt, &proposal.CreatedAt, &proposal.UpdatedAt,
		)
		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan proposal: %w", err)
		}

		// Unmarshal the JSONB
		if err := json.Unmarshal(proposedDataJSONB, &proposal.ProposedData); err != nil {
			return nil, 0, fmt.Errorf("failed to unmarshal proposed data: %w", err)
		}

		proposals = append(proposals, proposal)
	}

	return proposals, total, nil
}

// UpdateProposalStatus updates the status of a proposal
func (r *GovernanceRepository) UpdateProposalStatus(ctx context.Context, id uuid.UUID, status string, reviewerID *uuid.UUID) (*models.TermProposal, error) {
	now := time.Now()
	query := `
		UPDATE term_proposals
		SET status = $1, reviewed_by = $2, reviewed_at = $3, updated_at = $4
		WHERE id = $5
		RETURNING id, term_id, proposal_type, proposed_data, reason, status, proposed_by, reviewed_by, reviewed_at, created_at, updated_at
	`

	proposal := &models.TermProposal{}
	var proposedDataJSONB []byte
	err := database.DB.QueryRow(ctx, query, status, reviewerID, now, now, id).Scan(
		&proposal.ID, &proposal.TermID, &proposal.ProposalType, &proposedDataJSONB, &proposal.Reason, &proposal.Status, &proposal.ProposedBy, &proposal.ReviewedBy, &proposal.ReviewedAt, &proposal.CreatedAt, &proposal.UpdatedAt,
	)

	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("proposal not found")
		}
		return nil, fmt.Errorf("failed to update proposal: %w", err)
	}

	// Unmarshal the JSONB
	if err := json.Unmarshal(proposedDataJSONB, &proposal.ProposedData); err != nil {
		return nil, fmt.Errorf("failed to unmarshal proposed data: %w", err)
	}

	return proposal, nil
}

// CreateFlag creates a new term flag
func (r *GovernanceRepository) CreateFlag(ctx context.Context, termID uuid.UUID, req models.CreateFlagRequest, userID *uuid.UUID) (*models.TermFlag, error) {
	flag := &models.TermFlag{
		ID:          uuid.New(),
		TermID:      termID,
		FlagType:    req.FlagType,
		Description: req.Description,
		Status:      "open",
		FlaggedBy:   userID,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	query := `
		INSERT INTO term_flags (id, term_id, flag_type, description, status, flagged_by, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, term_id, flag_type, description, status, flagged_by, resolved_by, resolved_at, created_at, updated_at
	`

	err := database.DB.QueryRow(ctx, query,
		flag.ID, flag.TermID, flag.FlagType, flag.Description, flag.Status, flag.FlaggedBy, flag.CreatedAt, flag.UpdatedAt,
	).Scan(
		&flag.ID, &flag.TermID, &flag.FlagType, &flag.Description, &flag.Status, &flag.FlaggedBy, &flag.ResolvedBy, &flag.ResolvedAt, &flag.CreatedAt, &flag.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to create flag: %w", err)
	}

	return flag, nil
}

// GetFlagByID retrieves a flag by ID
func (r *GovernanceRepository) GetFlagByID(ctx context.Context, id uuid.UUID) (*models.TermFlag, error) {
	flag := &models.TermFlag{}

	query := `
		SELECT id, term_id, flag_type, description, status, flagged_by, resolved_by, resolved_at, created_at, updated_at
		FROM term_flags
		WHERE id = $1
	`

	err := database.DB.QueryRow(ctx, query, id).Scan(
		&flag.ID, &flag.TermID, &flag.FlagType, &flag.Description, &flag.Status, &flag.FlaggedBy, &flag.ResolvedBy, &flag.ResolvedAt, &flag.CreatedAt, &flag.UpdatedAt,
	)

	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("flag not found")
		}
		return nil, fmt.Errorf("failed to get flag: %w", err)
	}

	return flag, nil
}

// ListFlags retrieves a list of flags with optional filtering
func (r *GovernanceRepository) ListFlags(ctx context.Context, termID *uuid.UUID, status *string, limit, offset int) ([]models.TermFlag, int, error) {
	var flags []models.TermFlag
	var total int

	baseQuery := "FROM term_flags WHERE 1=1"
	args := []interface{}{}
	argPos := 1

	if termID != nil {
		baseQuery += fmt.Sprintf(" AND term_id = $%d", argPos)
		args = append(args, *termID)
		argPos++
	}

	if status != nil {
		baseQuery += fmt.Sprintf(" AND status = $%d", argPos)
		args = append(args, *status)
		argPos++
	}

	// Get total count
	countQuery := "SELECT COUNT(*) " + baseQuery
	err := database.DB.QueryRow(ctx, countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count flags: %w", err)
	}

	// Get flags
	query := `
		SELECT id, term_id, flag_type, description, status, flagged_by, resolved_by, resolved_at, created_at, updated_at
		` + baseQuery + `
		ORDER BY created_at DESC
		LIMIT $` + fmt.Sprintf("%d", argPos) + ` OFFSET $` + fmt.Sprintf("%d", argPos+1)

	args = append(args, limit, offset)
	rows, err := database.DB.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to list flags: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var flag models.TermFlag
		err := rows.Scan(
			&flag.ID, &flag.TermID, &flag.FlagType, &flag.Description, &flag.Status, &flag.FlaggedBy, &flag.ResolvedBy, &flag.ResolvedAt, &flag.CreatedAt, &flag.UpdatedAt,
		)
		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan flag: %w", err)
		}
		flags = append(flags, flag)
	}

	return flags, total, nil
}

// UpdateFlagStatus updates the status of a flag
func (r *GovernanceRepository) UpdateFlagStatus(ctx context.Context, id uuid.UUID, status string, resolverID *uuid.UUID) (*models.TermFlag, error) {
	now := time.Now()
	var resolvedAt *time.Time
	if status == "resolved" {
		resolvedAt = &now
	}

	query := `
		UPDATE term_flags
		SET status = $1, resolved_by = $2, resolved_at = $3, updated_at = $4
		WHERE id = $5
		RETURNING id, term_id, flag_type, description, status, flagged_by, resolved_by, resolved_at, created_at, updated_at
	`

	flag := &models.TermFlag{}
	err := database.DB.QueryRow(ctx, query, status, resolverID, resolvedAt, now, id).Scan(
		&flag.ID, &flag.TermID, &flag.FlagType, &flag.Description, &flag.Status, &flag.FlaggedBy, &flag.ResolvedBy, &flag.ResolvedAt, &flag.CreatedAt, &flag.UpdatedAt,
	)

	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("flag not found")
		}
		return nil, fmt.Errorf("failed to update flag: %w", err)
	}

	return flag, nil
}

