package repository

import (
	"context"
	"fmt"

	"clarityconnect/internal/models"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"clarityconnect/pkg/database"
)

type BrandingRepository struct{}

func NewBrandingRepository() *BrandingRepository {
	return &BrandingRepository{}
}

// GetBrandingConfig retrieves branding configuration for an organization
func (r *BrandingRepository) GetBrandingConfig(ctx context.Context, organizationID string) (*models.BrandingConfig, error) {
	config := &models.BrandingConfig{}

	query := `
		SELECT id, organization_id, light_color, pastel_color, primary_color, dark_color, created_at, updated_at
		FROM branding_config
		WHERE organization_id = $1
	`

	err := database.DB.QueryRow(ctx, query, organizationID).Scan(
		&config.ID, &config.OrganizationID, &config.LightColor, &config.PastelColor, &config.PrimaryColor, &config.DarkColor, &config.CreatedAt, &config.UpdatedAt,
	)

	if err != nil {
		if err == pgx.ErrNoRows {
			// Return default config if not found
			return &models.BrandingConfig{
				OrganizationID: organizationID,
				LightColor:     "#EAF9E7",
				PastelColor:    "#C0E6BA",
				PrimaryColor:   "#4CA771",
				DarkColor:      "#013237",
			}, nil
		}
		return nil, fmt.Errorf("failed to get branding config: %w", err)
	}

	return config, nil
}

// UpdateBrandingConfig updates branding configuration
func (r *BrandingRepository) UpdateBrandingConfig(ctx context.Context, organizationID string, config *models.BrandingConfig) (*models.BrandingConfig, error) {
	query := `
		INSERT INTO branding_config (organization_id, light_color, pastel_color, primary_color, dark_color, updated_at)
		VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
		ON CONFLICT (organization_id) 
		DO UPDATE SET 
			light_color = EXCLUDED.light_color,
			pastel_color = EXCLUDED.pastel_color,
			primary_color = EXCLUDED.primary_color,
			dark_color = EXCLUDED.dark_color,
			updated_at = CURRENT_TIMESTAMP
		RETURNING id, organization_id, light_color, pastel_color, primary_color, dark_color, created_at, updated_at
	`

	err := database.DB.QueryRow(ctx, query,
		organizationID, config.LightColor, config.PastelColor, config.PrimaryColor, config.DarkColor,
	).Scan(
		&config.ID, &config.OrganizationID, &config.LightColor, &config.PastelColor, &config.PrimaryColor, &config.DarkColor, &config.CreatedAt, &config.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("failed to update branding config: %w", err)
	}

	return config, nil
}

