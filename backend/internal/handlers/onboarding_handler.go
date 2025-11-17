package handlers

import (
	"net/http"

	"clarityconnect/internal/repository"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type OnboardingHandler struct {
	repo *repository.OnboardingRepository
}

func NewOnboardingHandler() *OnboardingHandler {
	return &OnboardingHandler{
		repo: repository.NewOnboardingRepository(),
	}
}

// GetOnboardingPath handles GET /api/v1/onboarding/path
func (h *OnboardingHandler) GetOnboardingPath(c *gin.Context) {
	role := c.Query("role")
	if role == "" {
		role = "viewer" // default
	}

	cluster := c.Query("cluster")
	var clusterPtr *string
	if cluster != "" {
		clusterPtr = &cluster
	}

	path, err := h.repo.GetOnboardingPath(c.Request.Context(), role, clusterPtr)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, path)
}

// GetOnboardingProgress handles GET /api/v1/onboarding/progress
func (h *OnboardingHandler) GetOnboardingProgress(c *gin.Context) {
	// For POC, use default user ID
	defaultUserID := uuid.MustParse("00000000-0000-0000-0000-000000000001")

	progress, err := h.repo.GetOnboardingProgress(c.Request.Context(), defaultUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, progress)
}

// CompleteOnboarding handles POST /api/v1/onboarding/complete
func (h *OnboardingHandler) CompleteOnboarding(c *gin.Context) {
	// For POC, use default user ID
	defaultUserID := uuid.MustParse("00000000-0000-0000-0000-000000000001")

	err := h.repo.CompleteOnboarding(c.Request.Context(), defaultUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "onboarding completed"})
}

