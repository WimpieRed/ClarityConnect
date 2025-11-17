package handlers

import (
	"net/http"

	"clarityconnect/internal/repository"

	"github.com/gin-gonic/gin"
)

type ComplianceHandler struct {
	repo *repository.ComplianceRepository
}

func NewComplianceHandler() *ComplianceHandler {
	return &ComplianceHandler{
		repo: repository.NewComplianceRepository(),
	}
}

// GetComplianceDashboard handles GET /api/v1/compliance/dashboard
func (h *ComplianceHandler) GetComplianceDashboard(c *gin.Context) {
	framework := c.Query("framework")
	var frameworkPtr *string
	if framework != "" {
		frameworkPtr = &framework
	}

	dashboard, err := h.repo.GetComplianceDashboard(c.Request.Context(), frameworkPtr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, dashboard)
}

// GetComplianceTerms handles GET /api/v1/compliance/terms
func (h *ComplianceHandler) GetComplianceTerms(c *gin.Context) {
	framework := c.Query("framework")
	if framework == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "framework parameter is required"})
		return
	}

	terms, err := h.repo.GetComplianceTerms(c.Request.Context(), framework)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": terms, "total": len(terms)})
}

// GetComplianceGaps handles GET /api/v1/compliance/gaps
func (h *ComplianceHandler) GetComplianceGaps(c *gin.Context) {
	framework := c.Query("framework")
	var frameworkPtr *string
	if framework != "" {
		frameworkPtr = &framework
	}

	gaps, err := h.repo.GetComplianceGaps(c.Request.Context(), frameworkPtr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": gaps, "total": len(gaps)})
}

