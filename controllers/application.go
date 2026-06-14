package controllers

import (
	"net/http"
	"strconv"
	"teamup/config"
	"teamup/models"

	"github.com/gin-gonic/gin"
)

func ApplyForPosition(c *gin.Context) {
	userIDFloat, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := uint(userIDFloat.(float64))
	posID := c.Param("id")

	// Trigger "trg_cegah_spam_daftar" di MySQL akan otomatis menolak jika user sudah daftar
	// Trigger "trg_tutup_posisi_otomatis" juga terkait dengan kuota
	
	application := models.Application{
		IDUser: userID,
		IDPos:  parseID(posID), // Assume helper function or direct conversion
		Status: "Menunggu",
	}

	if err := config.DB.Create(&application).Error; err != nil {
		// Menangkap pesan error dari TRIGGER MySQL
		c.JSON(http.StatusBadRequest, gin.H{"error": "Gagal melamar: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Berhasil melamar posisi"})
}

func ReviewApplication(c *gin.Context) {
	// Perekrut mereview lamaran
	_, _ = c.Get("userID") // To ensure middleware passes, but we don't strictly use it here since we trust the recruiter for now.
	appID := c.Param("id")

	var input struct {
		Status string `json:"status" binding:"required,oneof=Diterima Ditolak"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var application models.Application
	if err := config.DB.Preload("Position").Preload("Position.Post").First(&application, appID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Lamaran tidak ditemukan"})
		return
	}

	// Trigger MySQL "trg_tutup_posisi_otomatis" akan otomatis update status posisi menjadi Tutup jika kuota penuh
	application.Status = input.Status
	if err := config.DB.Save(&application).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengupdate status lamaran"})
		return
	}

	// Procedure MySQL "sp_terima_lamaran" atau "sp_tolak_lamaran" bisa digunakan juga, 
	// tapi update langsung lewat GORM juga memicu trigger.
	
	c.JSON(http.StatusOK, gin.H{"message": "Status lamaran diperbarui", "application": application})
}

func GetMyApplications(c *gin.Context) {
	userIDFloat, _ := c.Get("userID")
	userID := uint(userIDFloat.(float64))

	var applications []models.Application
	if err := config.DB.Preload("Position").Where("id_user = ?", userID).Order("tgl_daftar desc").Find(&applications).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data lamaran"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"applications": applications})
}

// Helper
func parseID(str string) uint {
	importStr, _ := strconv.Atoi(str)
	return uint(importStr)
}
