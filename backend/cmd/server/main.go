package main

import (
	"log"

	"clarityconnect/internal/handlers"
	"clarityconnect/internal/middleware"
	"clarityconnect/pkg/database"

	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize database
	if err := database.InitDB(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer database.CloseDB()

	// Run migrations
	if err := database.RunMigrations(); err != nil {
		log.Printf("Warning: Failed to run migrations: %v", err)
	}

	// Setup router
	r := gin.Default()

	// Apply CORS middleware
	r.Use(middleware.SetupCORS())

	// Apply usage logging middleware
	r.Use(middleware.UsageLoggerMiddleware())

	// Apply user context middleware (extracts department from headers)
	r.Use(middleware.UserContextMiddleware())

	// Setup routes
	setupRoutes(r)

	// Start server
	port := ":3001"
	log.Printf("Server starting on port %s", port)
	if err := r.Run(port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func setupRoutes(r *gin.Engine) {
	api := r.Group("/api/v1")
	{
		// Health check
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "ok"})
		})

		// Initialize handlers
		termHandler := handlers.NewTermHandler()
		searchHandler := handlers.NewSearchHandler()
		governanceHandler := handlers.NewGovernanceHandler()
		brandingHandler := handlers.NewBrandingHandler()
		gapHandler := handlers.NewGapHandler()
		usageHandler := handlers.NewUsageHandler()
		onboardingHandler := handlers.NewOnboardingHandler()
		complianceHandler := handlers.NewComplianceHandler()
		versionHandler := handlers.NewVersionHandler()

		// Terms routes
		terms := api.Group("/terms")
		{
			terms.GET("", termHandler.ListTerms)
			terms.POST("", termHandler.CreateTerm)
			terms.GET("/:id", termHandler.GetTerm)
			terms.PUT("/:id", termHandler.UpdateTerm)
			terms.DELETE("/:id", termHandler.DeleteTerm)
			terms.POST("/:id/contexts", termHandler.CreateContext)
			terms.POST("/:id/examples", termHandler.CreateExample)
			terms.POST("/:id/relationships", termHandler.CreateRelationship)
			terms.GET("/:id/versions", versionHandler.ListVersions)
			terms.POST("/:id/rollback", versionHandler.RollbackVersion)
		}

		// Search routes
		api.GET("/search", searchHandler.SearchTerms)

		// Governance routes
		proposals := api.Group("/proposals")
		{
			proposals.GET("", governanceHandler.ListProposals)
			proposals.POST("", governanceHandler.CreateProposal)
			proposals.GET("/:id", governanceHandler.GetProposal)
			proposals.PATCH("/:id/status", governanceHandler.UpdateProposalStatus)
		}

		flags := api.Group("/flags")
		{
			flags.GET("", governanceHandler.ListFlags)
			flags.GET("/:id", governanceHandler.GetFlag)
			flags.PATCH("/:id/status", governanceHandler.UpdateFlagStatus)
		}

		api.POST("/terms/:id/flags", governanceHandler.CreateFlag)

		// Branding routes
		api.GET("/branding", brandingHandler.GetBrandingConfig)
		api.PUT("/branding", brandingHandler.UpdateBrandingConfig)

		// Gap analysis routes
		gaps := api.Group("/gaps")
		{
			gaps.GET("", gapHandler.ListGaps)
			gaps.GET("/:id", gapHandler.GetGap)
			gaps.POST("/detect", gapHandler.DetectGaps)
			gaps.PATCH("/:id/resolve", gapHandler.ResolveGap)
		}

		// Cluster routes
		clusters := api.Group("/clusters")
		{
			clusters.GET("", gapHandler.ListClusters)
			clusters.GET("/:name/terms", gapHandler.GetClusterTerms)
			clusters.GET("/:name/comparison", gapHandler.GetClusterComparison)
		}

		// Term cluster comparison
		api.GET("/terms/:id/cluster-comparison", gapHandler.GetTermClusterComparison)

		// Analytics routes
		analytics := api.Group("/analytics")
		{
			analytics.GET("/gaps", gapHandler.GetGapAnalytics)
			analytics.GET("/cluster-coverage", gapHandler.GetClusterCoverage)
		}

		// Usage analytics routes
		api.GET("/terms/:id/views", usageHandler.GetTermViewCount)
		api.GET("/usage/recently-viewed", usageHandler.GetRecentlyViewedTerms)

		// Onboarding routes
		onboarding := api.Group("/onboarding")
		{
			onboarding.GET("/path", onboardingHandler.GetOnboardingPath)
			onboarding.GET("/progress", onboardingHandler.GetOnboardingProgress)
			onboarding.POST("/complete", onboardingHandler.CompleteOnboarding)
		}

		// Compliance routes
		compliance := api.Group("/compliance")
		{
			compliance.GET("/dashboard", complianceHandler.GetComplianceDashboard)
			compliance.GET("/terms", complianceHandler.GetComplianceTerms)
			compliance.GET("/gaps", complianceHandler.GetComplianceGaps)
		}

		// Version routes
		api.GET("/versions/:id", versionHandler.GetVersion)
		api.GET("/versions/compare", versionHandler.CompareVersions)
	}
}

