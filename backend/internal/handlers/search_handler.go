package handlers

import (
	"net/http"
	"strconv"

	"clarityconnect/internal/models"
	"clarityconnect/internal/repository"

	"github.com/gin-gonic/gin"
)

type SearchHandler struct {
	repo *repository.TermRepository
}

func NewSearchHandler() *SearchHandler {
	return &SearchHandler{
		repo: repository.NewTermRepository(),
	}
}

// SearchTerms handles GET /api/v1/search
func (h *SearchHandler) SearchTerms(c *gin.Context) {
	var req models.SearchRequest

	req.Query = c.Query("q")
	if req.Query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "query parameter 'q' is required"})
		return
	}

	if category := c.Query("category"); category != "" {
		req.Category = &category
	}

	if cluster := c.Query("cluster"); cluster != "" {
		req.Cluster = &cluster
	}

	if system := c.Query("system"); system != "" {
		req.System = &system
	}

	if tags := c.QueryArray("tags"); len(tags) > 0 {
		req.Tags = tags
	}

	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))
	req.Limit = limit
	req.Offset = offset

	// Use context-aware search if cluster or system filters are provided
	var terms []models.Term
	var total int
	var err error

	if req.Cluster != nil || req.System != nil {
		terms, total, err = h.repo.SearchTermsWithContext(c.Request.Context(), req)
	} else {
		terms, total, err = h.repo.SearchTerms(c.Request.Context(), req)
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  terms,
		"total": total,
		"limit": limit,
		"offset": offset,
		"query":  req.Query,
	})
}

