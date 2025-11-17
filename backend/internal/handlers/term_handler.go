package handlers

import (
	"net/http"
	"strconv"

	"clarityconnect/internal/middleware"
	"clarityconnect/internal/models"
	"clarityconnect/internal/repository"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type TermHandler struct {
	repo *repository.TermRepository
}

func NewTermHandler() *TermHandler {
	return &TermHandler{
		repo: repository.NewTermRepository(),
	}
}

// CreateTerm handles POST /api/v1/terms
func (h *TermHandler) CreateTerm(c *gin.Context) {
	var req models.CreateTermRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// For POC, use default user ID (no auth yet)
	defaultUserID := uuid.MustParse("00000000-0000-0000-0000-000000000001")

	term, err := h.repo.CreateTerm(c.Request.Context(), req, &defaultUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, term)
}

// GetTerm handles GET /api/v1/terms/:id
func (h *TermHandler) GetTerm(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid term ID"})
		return
	}

	term, err := h.repo.GetTermByID(c.Request.Context(), id)
	if err != nil {
		if err.Error() == "term not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, term)
}

// ListTerms handles GET /api/v1/terms
func (h *TermHandler) ListTerms(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))
	category := c.Query("category")

	var categoryPtr *string
	if category != "" {
		categoryPtr = &category
	}

	// Extract user department from context (set by middleware)
	var userDepartmentPtr *string
	if dept, exists := c.Get(middleware.UserDepartmentKey); exists {
		if deptStr, ok := dept.(string); ok && deptStr != "" {
			userDepartmentPtr = &deptStr
		}
	}

	terms, total, err := h.repo.ListTerms(c.Request.Context(), limit, offset, categoryPtr, userDepartmentPtr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  terms,
		"total": total,
		"limit": limit,
		"offset": offset,
	})
}

// UpdateTerm handles PUT /api/v1/terms/:id
func (h *TermHandler) UpdateTerm(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid term ID"})
		return
	}

	var req models.UpdateTermRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// For POC, use default user ID
	defaultUserID := uuid.MustParse("00000000-0000-0000-0000-000000000001")

	// Get current term to create version snapshot before updating
	currentTerm, err := h.repo.GetTermByID(c.Request.Context(), id)
	if err != nil {
		if err.Error() == "term not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Create version snapshot of current state before update
	versionRepo := repository.NewVersionRepository()
	var changeReason *string
	if req.ChangeReason != nil {
		changeReason = req.ChangeReason
	}
	_, err = versionRepo.CreateVersion(c.Request.Context(), id, currentTerm, &defaultUserID, changeReason)
	if err != nil {
		// Log error but don't fail the update
		// In production, you might want to handle this differently
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create version snapshot: " + err.Error()})
		return
	}

	term, err := h.repo.UpdateTerm(c.Request.Context(), id, req, &defaultUserID)
	if err != nil {
		if err.Error() == "term not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, term)
}

// DeleteTerm handles DELETE /api/v1/terms/:id
func (h *TermHandler) DeleteTerm(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid term ID"})
		return
	}

	err = h.repo.DeleteTerm(c.Request.Context(), id)
	if err != nil {
		if err.Error() == "term not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "term deleted successfully"})
}

// CreateContext handles POST /api/v1/terms/:id/contexts
func (h *TermHandler) CreateContext(c *gin.Context) {
	termID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid term ID"})
		return
	}

	var req models.CreateContextRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	defaultUserID := uuid.MustParse("00000000-0000-0000-0000-000000000001")

	context, err := h.repo.CreateContext(c.Request.Context(), termID, req, &defaultUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, context)
}

// CreateExample handles POST /api/v1/terms/:id/examples
func (h *TermHandler) CreateExample(c *gin.Context) {
	termID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid term ID"})
		return
	}

	var req models.CreateExampleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	defaultUserID := uuid.MustParse("00000000-0000-0000-0000-000000000001")

	example, err := h.repo.CreateExample(c.Request.Context(), termID, req, &defaultUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, example)
}

// CreateRelationship handles POST /api/v1/terms/:id/relationships
func (h *TermHandler) CreateRelationship(c *gin.Context) {
	termID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid term ID"})
		return
	}

	var req models.CreateRelationshipRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	defaultUserID := uuid.MustParse("00000000-0000-0000-0000-000000000001")

	relationship, err := h.repo.CreateRelationship(c.Request.Context(), termID, req, &defaultUserID)
	if err != nil {
		if err.Error() == "relationship already exists" {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, relationship)
}

