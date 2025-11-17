package handlers

import (
	"net/http"
	"strconv"

	"clarityconnect/internal/models"
	"clarityconnect/internal/repository"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type GovernanceHandler struct {
	proposalRepo *repository.GovernanceRepository
	flagRepo     *repository.GovernanceRepository
}

func NewGovernanceHandler() *GovernanceHandler {
	return &GovernanceHandler{
		proposalRepo: repository.NewGovernanceRepository(),
		flagRepo:     repository.NewGovernanceRepository(),
	}
}

// CreateProposal handles POST /api/v1/proposals
func (h *GovernanceHandler) CreateProposal(c *gin.Context) {
	var req models.CreateProposalRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	defaultUserID := uuid.MustParse("00000000-0000-0000-0000-000000000001")

	proposal, err := h.proposalRepo.CreateProposal(c.Request.Context(), req, &defaultUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, proposal)
}

// GetProposal handles GET /api/v1/proposals/:id
func (h *GovernanceHandler) GetProposal(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid proposal ID"})
		return
	}

	proposal, err := h.proposalRepo.GetProposalByID(c.Request.Context(), id)
	if err != nil {
		if err.Error() == "proposal not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, proposal)
}

// ListProposals handles GET /api/v1/proposals
func (h *GovernanceHandler) ListProposals(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))
	status := c.Query("status")

	var statusPtr *string
	if status != "" {
		statusPtr = &status
	}

	proposals, total, err := h.proposalRepo.ListProposals(c.Request.Context(), statusPtr, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  proposals,
		"total": total,
		"limit": limit,
		"offset": offset,
	})
}

// UpdateProposalStatus handles PATCH /api/v1/proposals/:id/status
func (h *GovernanceHandler) UpdateProposalStatus(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid proposal ID"})
		return
	}

	var req struct {
		Status string `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.Status != "approved" && req.Status != "rejected" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "status must be 'approved' or 'rejected'"})
		return
	}

	defaultUserID := uuid.MustParse("00000000-0000-0000-0000-000000000001")

	proposal, err := h.proposalRepo.UpdateProposalStatus(c.Request.Context(), id, req.Status, &defaultUserID)
	if err != nil {
		if err.Error() == "proposal not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, proposal)
}

// CreateFlag handles POST /api/v1/terms/:id/flags
func (h *GovernanceHandler) CreateFlag(c *gin.Context) {
	termID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid term ID"})
		return
	}

	var req models.CreateFlagRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	defaultUserID := uuid.MustParse("00000000-0000-0000-0000-000000000001")

	flag, err := h.flagRepo.CreateFlag(c.Request.Context(), termID, req, &defaultUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, flag)
}

// GetFlag handles GET /api/v1/flags/:id
func (h *GovernanceHandler) GetFlag(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid flag ID"})
		return
	}

	flag, err := h.flagRepo.GetFlagByID(c.Request.Context(), id)
	if err != nil {
		if err.Error() == "flag not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, flag)
}

// ListFlags handles GET /api/v1/flags
func (h *GovernanceHandler) ListFlags(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))
	termIDStr := c.Query("term_id")
	status := c.Query("status")

	var termIDPtr *uuid.UUID
	if termIDStr != "" {
		termID, err := uuid.Parse(termIDStr)
		if err == nil {
			termIDPtr = &termID
		}
	}

	var statusPtr *string
	if status != "" {
		statusPtr = &status
	}

	flags, total, err := h.flagRepo.ListFlags(c.Request.Context(), termIDPtr, statusPtr, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  flags,
		"total": total,
		"limit": limit,
		"offset": offset,
	})
}

// UpdateFlagStatus handles PATCH /api/v1/flags/:id/status
func (h *GovernanceHandler) UpdateFlagStatus(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid flag ID"})
		return
	}

	var req struct {
		Status string `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.Status != "open" && req.Status != "resolved" && req.Status != "dismissed" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "status must be 'open', 'resolved', or 'dismissed'"})
		return
	}

	defaultUserID := uuid.MustParse("00000000-0000-0000-0000-000000000001")

	flag, err := h.flagRepo.UpdateFlagStatus(c.Request.Context(), id, req.Status, &defaultUserID)
	if err != nil {
		if err.Error() == "flag not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, flag)
}

