package controllers

import (
	"net/http"
	"teamup/config"
	"teamup/models"

	"github.com/gin-gonic/gin"
)

func GetMyNotifications(c *gin.Context) {
	userIDFloat, _ := c.Get("userID")
	userID := uint(userIDFloat.(float64))

	var notifications []models.Notification
	if err := config.DB.Where("id_user = ?", userID).Order("tgl_dibuat desc").Find(&notifications).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil notifikasi"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"notifications": notifications})
}

func MarkNotificationRead(c *gin.Context) {
	userIDFloat, _ := c.Get("userID")
	userID := uint(userIDFloat.(float64))

	notifID := c.Param("id")

	var notification models.Notification
	if err := config.DB.First(&notification, notifID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Notifikasi tidak ditemukan"})
		return
	}

	if notification.IDUser != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	notification.StatusBaca = true
	config.DB.Save(&notification)

	c.JSON(http.StatusOK, gin.H{"message": "Notifikasi ditandai sudah dibaca"})
}
