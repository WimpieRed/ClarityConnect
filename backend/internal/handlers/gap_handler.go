package handlers

import (
	"net/http"
	"strconv"
	"time"

	"clarityconnect/internal/models"
	"clarityconnect/internal/repository"
	"clarityconnect/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type GapHandler struct {
	repo    *repository.GapRepository
	service *service.GapDetectionService
}

func NewGapHandler() *GapHandler {
	return &GapHandler{
		repo:    repository.NewGapRepository(),
		service: service.NewGapDetectionService(),
	}
}

// ListGaps handles GET /api/v1/gaps
func (h *GapHandler) ListGaps(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))
	gapType := c.Query("gap_type")
	cluster := c.Query("cluster")
	severity := c.Query("severity")
	resolvedStr := c.Query("resolved")

	var gapTypePtr *string
	if gapType != "" {
		gapTypePtr = &gapType
	}

	var clusterPtr *string
	if cluster != "" {
		clusterPtr = &cluster
	}

	var severityPtr *string
	if severity != "" {
		severityPtr = &severity
	}

	var resolvedPtr *bool
	if resolvedStr != "" {
		resolved := resolvedStr == "true"
		resolvedPtr = &resolved
	}

	gaps, total, err := h.repo.ListGaps(c.Request.Context(), limit, offset, gapTypePtr, clusterPtr, severityPtr, resolvedPtr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  gaps,
		"total": total,
		"limit": limit,
		"offset": offset,
	})
}

// GetGap handles GET /api/v1/gaps/:id
func (h *GapHandler) GetGap(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid gap ID"})
		return
	}

	gap, err := h.repo.GetGapByID(c.Request.Context(), id)
	if err != nil {
		if err.Error() == "gap not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gap)
}

// DetectGaps handles POST /api/v1/gaps/detect
func (h *GapHandler) DetectGaps(c *gin.Context) {
	gaps, err := h.service.DetectGaps(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Gap detection completed",
		"gaps_detected": len(gaps),
		"gaps": gaps,
	})
}

// ResolveGap handles PATCH /api/v1/gaps/:id/resolve
func (h *GapHandler) ResolveGap(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid gap ID"})
		return
	}

	// For POC, use default user ID
	defaultUserID := uuid.MustParse("00000000-0000-0000-0000-000000000001")

	err = h.repo.ResolveGap(c.Request.Context(), id, &defaultUserID)
	if err != nil {
		if err.Error() == "gap not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "gap resolved successfully"})
}

// ListClusters handles GET /api/v1/clusters
func (h *GapHandler) ListClusters(c *gin.Context) {
	clusters, err := h.repo.GetClusters(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// If no clusters in database, get from contexts
	if len(clusters) == 0 {
		clusterNames, err := h.repo.GetAllClustersFromContexts(c.Request.Context())
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Convert to cluster models
		clusters = make([]models.Cluster, 0, len(clusterNames))
		for _, name := range clusterNames {
			clusters = append(clusters, models.Cluster{
				ID:        uuid.New(),
				Name:      name,
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			})
		}
	}

	c.JSON(http.StatusOK, clusters)
}

// GetClusterTerms handles GET /api/v1/clusters/:name/terms
func (h *GapHandler) GetClusterTerms(c *gin.Context) {
	clusterName := c.Param("name")
	if clusterName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "cluster name is required"})
		return
	}

	terms, err := h.repo.GetTermsByCluster(c.Request.Context(), clusterName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, terms)
}

// GetClusterComparison handles GET /api/v1/clusters/:name/comparison
func (h *GapHandler) GetClusterComparison(c *gin.Context) {
	clusterName := c.Param("name")
	if clusterName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "cluster name is required"})
		return
	}

	// Get all clusters
	allClusters, err := h.repo.GetAllClustersFromContexts(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Get terms for the specified cluster
	terms, err := h.repo.GetTermsByCluster(c.Request.Context(), clusterName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Build comparison data
	comparison := make(map[string]interface{})
	comparison["cluster"] = clusterName
	comparison["terms"] = terms
	comparison["other_clusters"] = allClusters

	c.JSON(http.StatusOK, comparison)
}

// GetTermClusterComparison handles GET /api/v1/terms/:id/cluster-comparison
func (h *GapHandler) GetTermClusterComparison(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid term ID"})
		return
	}

	comparison, err := h.service.CompareClusters(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, comparison)
}

// GetGapAnalytics handles GET /api/v1/analytics/gaps
func (h *GapHandler) GetGapAnalytics(c *gin.Context) {
	analytics, err := h.repo.GetGapAnalytics(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, analytics)
}

// GetClusterCoverage handles GET /api/v1/analytics/cluster-coverage
func (h *GapHandler) GetClusterCoverage(c *gin.Context) {
	coverage, err := h.repo.GetClusterCoverage(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, coverage)
}

