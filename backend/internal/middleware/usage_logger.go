package middleware

import (
	"context"
	"net/http"
	"strings"

	"clarityconnect/pkg/database"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// UsageLoggerMiddleware logs term views for analytics
func UsageLoggerMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Only log GET requests to term detail endpoints
		if c.Request.Method == http.MethodGet && strings.HasPrefix(c.Request.URL.Path, "/api/v1/terms/") {
			termIDStr := c.Param("id")
			if termIDStr != "" {
				termID, err := uuid.Parse(termIDStr)
				if err == nil {
					// Extract cluster from query params if available
					cluster := c.Query("cluster")
					var clusterPtr *string
					if cluster != "" {
						clusterPtr = &cluster
					}
					// Log asynchronously to avoid blocking the request
					go logTermView(context.Background(), termID, clusterPtr)
				}
			}
		}

		c.Next()
	}
}

func logTermView(ctx context.Context, termID uuid.UUID, cluster *string) {
	// For POC, use default user ID (no auth yet)
	defaultUserID := uuid.MustParse("00000000-0000-0000-0000-000000000001")

	query := `
		INSERT INTO term_usage_logs (term_id, cluster, user_id, action, created_at)
		VALUES ($1, $2, $3, $4, NOW())
	`

	_, err := database.DB.Exec(ctx, query, termID, cluster, defaultUserID, "viewed")
	if err != nil {
		// Log error but don't fail the request
		// In production, use proper logging
		_ = err
	}
}

