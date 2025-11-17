package repository

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"clarityconnect/internal/models"

	"github.com/google/uuid"
	"clarityconnect/pkg/database"
)

type VersionRepository struct{}

func NewVersionRepository() *VersionRepository {
	return &VersionRepository{}
}

// CreateVersion creates a new version snapshot of a term
func (r *VersionRepository) CreateVersion(ctx context.Context, termID uuid.UUID, termData *models.Term, userID *uuid.UUID, reason *string) (*models.TermVersion, error) {
	// Get the latest version number for this term
	var latestVersion int
	err := database.DB.QueryRow(ctx, `
		SELECT COALESCE(MAX(version_number), 0) 
		FROM term_versions 
		WHERE term_id = $1
	`, termID).Scan(&latestVersion)
	if err != nil {
		return nil, fmt.Errorf("failed to get latest version: %w", err)
	}

	newVersionNumber := latestVersion + 1

	// Convert term to JSONB
	termJSON, err := json.Marshal(termData)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal term data: %w", err)
	}

	version := &models.TermVersion{
		ID:            uuid.New(),
		TermID:        termID,
		VersionNumber: newVersionNumber,
		TermData:      make(map[string]interface{}),
		ChangedBy:     userID,
		ChangeReason:  reason,
	}

	// Unmarshal back to map for storage
	if err := json.Unmarshal(termJSON, &version.TermData); err != nil {
		return nil, fmt.Errorf("failed to unmarshal term data: %w", err)
	}

	query := `
		INSERT INTO term_versions (id, term_id, version_number, term_data, changed_by, change_reason, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
		RETURNING created_at
	`

	var createdAt string
	err = database.DB.QueryRow(ctx, query,
		version.ID,
		version.TermID,
		version.VersionNumber,
		termJSON,
		version.ChangedBy,
		version.ChangeReason,
	).Scan(&createdAt)

	if err != nil {
		return nil, fmt.Errorf("failed to create version: %w", err)
	}

	return version, nil
}

// GetVersionsByTermID retrieves all versions for a term
func (r *VersionRepository) GetVersionsByTermID(ctx context.Context, termID uuid.UUID) ([]models.TermVersion, error) {
	query := `
		SELECT id, term_id, version_number, term_data, changed_by, change_reason, created_at
		FROM term_versions
		WHERE term_id = $1
		ORDER BY version_number DESC
	`

	rows, err := database.DB.Query(ctx, query, termID)
	if err != nil {
		return nil, fmt.Errorf("failed to query versions: %w", err)
	}
	defer rows.Close()

	var versions []models.TermVersion
	for rows.Next() {
		var version models.TermVersion
		var termDataJSON []byte
		var changedBy *uuid.UUID
		var changeReason *string

		err := rows.Scan(
			&version.ID,
			&version.TermID,
			&version.VersionNumber,
			&termDataJSON,
			&changedBy,
			&changeReason,
			&version.CreatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan version: %w", err)
		}

		// Unmarshal JSONB to map
		if err := json.Unmarshal(termDataJSON, &version.TermData); err != nil {
			return nil, fmt.Errorf("failed to unmarshal term data: %w", err)
		}

		version.ChangedBy = changedBy
		version.ChangeReason = changeReason
		versions = append(versions, version)
	}

	return versions, nil
}

// GetVersionByID retrieves a specific version by ID
func (r *VersionRepository) GetVersionByID(ctx context.Context, versionID uuid.UUID) (*models.TermVersion, error) {
	query := `
		SELECT id, term_id, version_number, term_data, changed_by, change_reason, created_at
		FROM term_versions
		WHERE id = $1
	`

	var version models.TermVersion
	var termDataJSON []byte
	var changedBy *uuid.UUID
	var changeReason *string

	err := database.DB.QueryRow(ctx, query, versionID).Scan(
		&version.ID,
		&version.TermID,
		&version.VersionNumber,
		&termDataJSON,
		&changedBy,
		&changeReason,
		&version.CreatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("version not found: %w", err)
	}

	// Unmarshal JSONB to map
	if err := json.Unmarshal(termDataJSON, &version.TermData); err != nil {
		return nil, fmt.Errorf("failed to unmarshal term data: %w", err)
	}

	version.ChangedBy = changedBy
	version.ChangeReason = changeReason

	return &version, nil
}

// GetLatestVersion retrieves the most recent version for a term
func (r *VersionRepository) GetLatestVersion(ctx context.Context, termID uuid.UUID) (*models.TermVersion, error) {
	query := `
		SELECT id, term_id, version_number, term_data, changed_by, change_reason, created_at
		FROM term_versions
		WHERE term_id = $1
		ORDER BY version_number DESC
		LIMIT 1
	`

	var version models.TermVersion
	var termDataJSON []byte
	var changedBy *uuid.UUID
	var changeReason *string

	err := database.DB.QueryRow(ctx, query, termID).Scan(
		&version.ID,
		&version.TermID,
		&version.VersionNumber,
		&termDataJSON,
		&changedBy,
		&changeReason,
		&version.CreatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("no versions found: %w", err)
	}

	// Unmarshal JSONB to map
	if err := json.Unmarshal(termDataJSON, &version.TermData); err != nil {
		return nil, fmt.Errorf("failed to unmarshal term data: %w", err)
	}

	version.ChangedBy = changedBy
	version.ChangeReason = changeReason

	return &version, nil
}

