package repository

import (
	"context"
	"fmt"

	"clarityconnect/internal/models"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"clarityconnect/pkg/database"
)

type OnboardingRepository struct{}

func NewOnboardingRepository() *OnboardingRepository {
	return &OnboardingRepository{}
}

// GetOnboardingPath retrieves an onboarding path for a role and cluster
func (r *OnboardingRepository) GetOnboardingPath(ctx context.Context, role string, cluster *string) (*models.OnboardingPath, error) {
	query := `
		SELECT id, role, cluster, term_ids, order_index, created_at
		FROM onboarding_paths
		WHERE role = $1
	`
	args := []interface{}{role}
	argPos := 2

	if cluster != nil {
		query += fmt.Sprintf(" AND cluster = $%d", argPos)
		args = append(args, *cluster)
		argPos++
	}

	query += " ORDER BY order_index ASC LIMIT 1"

	path := &models.OnboardingPath{}
	var termIDs []uuid.UUID

	err := database.DB.QueryRow(ctx, query, args...).Scan(
		&path.ID, &path.Role, &path.Cluster, &termIDs, &path.OrderIndex, &path.CreatedAt,
	)

	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("onboarding path not found")
		}
		return nil, fmt.Errorf("failed to get onboarding path: %w", err)
	}

	path.TermIDs = termIDs
	return path, nil
}

// GetOnboardingProgress gets the progress for a user
func (r *OnboardingRepository) GetOnboardingProgress(ctx context.Context, userID uuid.UUID) (map[string]interface{}, error) {
	// Get user's onboarding status
	var onboardingCompleted bool
	var department *string
	query := `SELECT onboarding_completed, department FROM users WHERE id = $1`
	err := database.DB.QueryRow(ctx, query, userID).Scan(&onboardingCompleted, &department)
	if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	// Count viewed terms from onboarding path
	var viewedCount int
	var totalCount int

	if department != nil {
		// Get onboarding path for user's role/department
		path, err := r.GetOnboardingPath(ctx, "viewer", department)
		if err == nil && path != nil {
			totalCount = len(path.TermIDs)
			if totalCount > 0 {
				// Count how many terms the user has viewed
				countQuery := `
					SELECT COUNT(DISTINCT term_id)
					FROM term_usage_logs
					WHERE user_id = $1 AND term_id = ANY($2) AND action = 'viewed'
				`

				database.DB.QueryRow(ctx, countQuery, userID, path.TermIDs).Scan(&viewedCount)
			}
		}
	}

	progress := float64(0)
	if totalCount > 0 {
		progress = float64(viewedCount) / float64(totalCount) * 100
	}

	return map[string]interface{}{
		"onboarding_completed": onboardingCompleted,
		"department":          department,
		"viewed_count":        viewedCount,
		"total_count":         totalCount,
		"progress_percent":    progress,
	}, nil
}

// CompleteOnboarding marks onboarding as complete for a user
func (r *OnboardingRepository) CompleteOnboarding(ctx context.Context, userID uuid.UUID) error {
	query := `
		UPDATE users
		SET onboarding_completed = TRUE, onboarding_completed_at = NOW()
		WHERE id = $1
	`

	_, err := database.DB.Exec(ctx, query, userID)
	if err != nil {
		return fmt.Errorf("failed to complete onboarding: %w", err)
	}

	return nil
}

