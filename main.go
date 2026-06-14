package main

import (
	"log"
	"os"
	"teamup/config"
	"teamup/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize Database Connection
	config.ConnectDB()

	// Initialize Router
	r := gin.Default()

	// Setup Routes
	routes.SetupRoutes(r)

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Println("Server is running on port " + port)
	r.Run(":" + port)
}
