package handlers

import (
	"net/http"
	"strconv"

	"clarityconnect/pkg/database"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type UsageHandler struct{}

func NewUsageHandler() *UsageHandler {
	return &UsageHandler{}
}

// GetTermViewCount returns the view count for a term
func (h *UsageHandler) GetTermViewCount(c *gin.Context) {
	termID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid term ID"})
		return
	}

	var count int
	query := `
		SELECT COUNT(*)
		FROM term_usage_logs
		WHERE term_id = $1 AND action = 'viewed'
	`

	err = database.DB.QueryRow(c.Request.Context(), query, termID).Scan(&count)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get view count"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"term_id": termID, "view_count": count})
}

// GetRecentlyViewedTerms returns recently viewed terms for a user
func (h *UsageHandler) GetRecentlyViewedTerms(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	
	// For POC, use default user ID
	defaultUserID := uuid.MustParse("00000000-0000-0000-0000-000000000001")

	query := `
		SELECT DISTINCT ON (tul.term_id) tul.term_id, t.term, t.base_definition, tul.created_at as last_viewed
		FROM term_usage_logs tul
		JOIN terms t ON tul.term_id = t.id
		WHERE tul.user_id = $1 AND tul.action = 'viewed'
		ORDER BY tul.term_id, tul.created_at DESC
		LIMIT $2
	`

	rows, err := database.DB.Query(c.Request.Context(), query, defaultUserID, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get recently viewed terms"})
		return
	}
	defer rows.Close()

	type RecentTerm struct {
		TermID        uuid.UUID `json:"term_id"`
		Term          string    `json:"term"`
		BaseDefinition string  `json:"base_definition"`
		LastViewed    string    `json:"last_viewed"`
	}

	var terms []RecentTerm
	for rows.Next() {
		var rt RecentTerm
		var lastViewed interface{}
		err := rows.Scan(&rt.TermID, &rt.Term, &rt.BaseDefinition, &lastViewed)
		if err != nil {
			continue
		}
		if lastViewed != nil {
			rt.LastViewed = lastViewed.(string)
		}
		terms = append(terms, rt)
	}

	c.JSON(http.StatusOK, gin.H{"data": terms})
}

