package handlers

import (
	"fmt"
	"net/http"

	"clarityconnect/internal/models"
	"clarityconnect/internal/repository"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type VersionHandler struct {
	versionRepo *repository.VersionRepository
	termRepo    *repository.TermRepository
}

func NewVersionHandler() *VersionHandler {
	return &VersionHandler{
		versionRepo: repository.NewVersionRepository(),
		termRepo:    repository.NewTermRepository(),
	}
}

// ListVersions handles GET /api/v1/terms/:id/versions
func (h *VersionHandler) ListVersions(c *gin.Context) {
	termID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid term ID"})
		return
	}

	versions, err := h.versionRepo.GetVersionsByTermID(c.Request.Context(), termID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, versions)
}

// GetVersion handles GET /api/v1/versions/:id
func (h *VersionHandler) GetVersion(c *gin.Context) {
	versionID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid version ID"})
		return
	}

	version, err := h.versionRepo.GetVersionByID(c.Request.Context(), versionID)
	if err != nil {
		if err.Error() == "version not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, version)
}

// CompareVersions handles GET /api/v1/versions/compare?version1=:id&version2=:id
func (h *VersionHandler) CompareVersions(c *gin.Context) {
	version1IDStr := c.Query("version1")
	version2IDStr := c.Query("version2")

	if version1IDStr == "" || version2IDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "version1 and version2 query parameters are required"})
		return
	}

	version1ID, err := uuid.Parse(version1IDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid version1 ID"})
		return
	}

	version2ID, err := uuid.Parse(version2IDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid version2 ID"})
		return
	}

	version1, err := h.versionRepo.GetVersionByID(c.Request.Context(), version1ID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "version1 not found"})
		return
	}

	version2, err := h.versionRepo.GetVersionByID(c.Request.Context(), version2ID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "version2 not found"})
		return
	}

	// Compare term data and find differences
	differences := make(map[string]map[string]interface{})
	
	// Compare simple fields
	fieldsToCompare := []string{"term", "base_definition", "category", "code_name"}
	for _, field := range fieldsToCompare {
		val1, ok1 := version1.TermData[field]
		val2, ok2 := version2.TermData[field]
		
		if !ok1 && !ok2 {
			continue
		}
		if !ok1 || !ok2 || val1 != val2 {
			differences[field] = map[string]interface{}{
				"old": val1,
				"new": val2,
			}
		}
	}

	// Compare arrays (tags, compliance_frameworks)
	arrayFields := []string{"tags", "compliance_frameworks"}
	for _, field := range arrayFields {
		arr1, _ := version1.TermData[field].([]interface{})
		arr2, _ := version2.TermData[field].([]interface{})
		
		if !arraysEqual(arr1, arr2) {
			differences[field] = map[string]interface{}{
				"old": arr1,
				"new": arr2,
			}
		}
	}

	response := gin.H{
		"version1":    version1,
		"version2":    version2,
		"differences": differences,
	}

	c.JSON(http.StatusOK, response)
}

// RollbackVersion handles POST /api/v1/terms/:id/rollback
func (h *VersionHandler) RollbackVersion(c *gin.Context) {
	termID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid term ID"})
		return
	}

	var req struct {
		VersionID uuid.UUID `json:"version_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get the version to rollback to
	version, err := h.versionRepo.GetVersionByID(c.Request.Context(), req.VersionID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "version not found"})
		return
	}

	// Verify version belongs to the term
	if version.TermID != termID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "version does not belong to this term"})
		return
	}

	// Get current term to create a version snapshot before rollback
	currentTerm, err := h.termRepo.GetTermByID(c.Request.Context(), termID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "term not found"})
		return
	}

	// Create version snapshot of current state before rollback
	defaultUserID := uuid.MustParse("00000000-0000-0000-0000-000000000001")
	reason := fmt.Sprintf("Rollback to version %d", version.VersionNumber)
	_, err = h.versionRepo.CreateVersion(c.Request.Context(), termID, currentTerm, &defaultUserID, &reason)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create version snapshot: " + err.Error()})
		return
	}

	// Extract term data from version and update the term
	updateReq := models.UpdateTermRequest{}
	if term, ok := version.TermData["term"].(string); ok {
		updateReq.Term = &term
	}
	if baseDefinition, ok := version.TermData["base_definition"].(string); ok {
		updateReq.BaseDefinition = &baseDefinition
	}
	if category, ok := version.TermData["category"].(string); ok {
		updateReq.Category = &category
	}
	if codeName, ok := version.TermData["code_name"].(string); ok {
		updateReq.CodeName = &codeName
	}
	if tags, ok := version.TermData["tags"].([]interface{}); ok {
		tagStrings := make([]string, len(tags))
		for i, tag := range tags {
			if tagStr, ok := tag.(string); ok {
				tagStrings[i] = tagStr
			}
		}
		updateReq.Tags = tagStrings
	}
	if complianceFrameworks, ok := version.TermData["compliance_frameworks"].([]interface{}); ok {
		frameworkStrings := make([]string, len(complianceFrameworks))
		for i, framework := range complianceFrameworks {
			if frameworkStr, ok := framework.(string); ok {
				frameworkStrings[i] = frameworkStr
			}
		}
		updateReq.ComplianceFrameworks = frameworkStrings
	}

	// Update the term
	updatedTerm, err := h.termRepo.UpdateTerm(c.Request.Context(), termID, updateReq, &defaultUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to rollback term: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, updatedTerm)
}

// Helper function to compare arrays
func arraysEqual(a, b []interface{}) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if a[i] != b[i] {
			return false
		}
	}
	return true
}

