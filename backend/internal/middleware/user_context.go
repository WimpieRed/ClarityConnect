package middleware

import (
	"github.com/gin-gonic/gin"
)

const UserDepartmentKey = "user_department"

// UserContextMiddleware extracts user department from request headers or query params
// and stores it in the Gin context for handlers to access
func UserContextMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Try to get department from header first
		department := c.GetHeader("X-User-Department")
		
		// Fall back to query parameter if header is not present
		if department == "" {
			department = c.Query("department")
		}
		
		// Store in context (empty string means show all terms)
		c.Set(UserDepartmentKey, department)
		
		c.Next()
	}
}

