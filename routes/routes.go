package routes

import (
	"os"
	"teamup/controllers"
	"teamup/middleware"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	"time"
)

func SetupRoutes(r *gin.Engine) {
	frontendUrl := os.Getenv("FRONTEND_URL")
	if frontendUrl == "" {
		frontendUrl = "http://localhost:3000"
	}

	// CORS Middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{frontendUrl},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	
	api := r.Group("/api")
	
	// Auth routes
	auth := api.Group("/auth")
	{
		auth.POST("/register", controllers.Register)
		auth.POST("/login", controllers.Login)
	}

	// Protected routes
	protected := api.Group("/")
	protected.Use(middleware.RequireAuth)
	{
		// Profile
		protected.GET("/profile", controllers.GetProfile)
		protected.PUT("/profile", controllers.UpdateProfile)
		protected.POST("/profile/portofolio", controllers.AddPortofolio)

		// Applications
		protected.POST("/posts/positions/:id/apply", controllers.ApplyForPosition)
		protected.POST("/applications/:id/review", controllers.ReviewApplication) // Recruiter
		protected.GET("/applications/me", controllers.GetMyApplications) // Applicant

		// Analytics
		protected.GET("/analytics/me", controllers.GetRecruiterAnalytics)

		// Posts Management
		protected.GET("/posts", controllers.GetPosts)
		protected.GET("/posts/me", controllers.GetMyPosts) // Recruiter's posts
		protected.GET("/posts/:id", controllers.GetPostDetails)
		protected.POST("/posts", controllers.CreatePost)
		protected.DELETE("/posts/:id", controllers.DeletePost) // Recruiter

		// Notifications
		protected.GET("/notifications", controllers.GetMyNotifications)
		protected.PUT("/notifications/:id/read", controllers.MarkNotificationRead)
	}
}
