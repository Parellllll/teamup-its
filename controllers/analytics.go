package controllers

import (
	"net/http"
	"teamup/config"

	"github.com/gin-gonic/gin"
)

type AnalyticsData struct {
	PostID          uint   `json:"post_id"`
	PostTitle       string `json:"post_title"`
	TotalApplicants int    `json:"total_applicants"`
	PendingCount    int    `json:"pending_count"`
	AcceptedCount   int    `json:"accepted_count"`
	RejectedCount   int    `json:"rejected_count"`
}

func GetRecruiterAnalytics(c *gin.Context) {
	userIDFloat, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := uint(userIDFloat.(float64))

	var analytics []AnalyticsData
	
	// Perform aggregation directly via SQL query without a View, using new table names
	query := `
		SELECT 
			p.id_post AS post_id,
			p.judul AS post_title,
			COUNT(a.id_app) AS total_applicants,
			SUM(CASE WHEN a.status = 'Menunggu' THEN 1 ELSE 0 END) AS pending_count,
			SUM(CASE WHEN a.status = 'Diterima' THEN 1 ELSE 0 END) AS accepted_count,
			SUM(CASE WHEN a.status = 'Ditolak' THEN 1 ELSE 0 END) AS rejected_count
		FROM recruitment_posts p
		LEFT JOIN positions pr ON pr.id_post = p.id_post
		LEFT JOIN applications a ON a.id_pos = pr.id_pos
		WHERE p.id_user = ?
		GROUP BY p.id_post;
	`
	
	if err := config.DB.Raw(query, userID).Scan(&analytics).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil analitik"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"analytics": analytics})
}
