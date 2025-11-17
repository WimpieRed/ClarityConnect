package handlers

import (
	"net/http"

	"clarityconnect/internal/models"
	"clarityconnect/internal/repository"

	"github.com/gin-gonic/gin"
)

type BrandingHandler struct {
	repo *repository.BrandingRepository
}

func NewBrandingHandler() *BrandingHandler {
	return &BrandingHandler{
		repo: repository.NewBrandingRepository(),
	}
}

// GetBrandingConfig handles GET /api/v1/branding
func (h *BrandingHandler) GetBrandingConfig(c *gin.Context) {
	organizationID := c.DefaultQuery("organization_id", "default")

	config, err := h.repo.GetBrandingConfig(c.Request.Context(), organizationID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, config)
}

// UpdateBrandingConfig handles PUT /api/v1/branding
func (h *BrandingHandler) UpdateBrandingConfig(c *gin.Context) {
	organizationID := c.DefaultQuery("organization_id", "default")

	var config models.BrandingConfig
	if err := c.ShouldBindJSON(&config); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.OrganizationID = organizationID

	updatedConfig, err := h.repo.UpdateBrandingConfig(c.Request.Context(), organizationID, &config)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, updatedConfig)
}

