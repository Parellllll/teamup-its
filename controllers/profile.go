package controllers

import (
	"net/http"
	"teamup/config"
	"teamup/models"

	"github.com/gin-gonic/gin"
)

func GetProfile(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var user models.User
	if err := config.DB.Preload("Skills").Preload("Portofolios").First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user": user})
}

type UpdateProfileInput struct {
	Bio        string   `json:"bio"`
	Departemen string   `json:"departemen"`
	Angkatan   int      `json:"angkatan"`
	Skills     []string `json:"skills"` // Array of skill names
}

func UpdateProfile(c *gin.Context) {
	userID, _ := c.Get("userID")
	
	var input UpdateProfileInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := config.DB.Preload("Skills").First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User tidak ditemukan"})
		return
	}

	user.Bio = input.Bio
	user.Departemen = input.Departemen
	user.Angkatan = input.Angkatan

	var skills []models.Skill
	for _, skillName := range input.Skills {
		var skill models.Skill
		config.DB.FirstOrCreate(&skill, models.Skill{NamaSkill: skillName, Kategori: "Lainnya"})
		skills = append(skills, skill)
	}

	if err := config.DB.Model(&user).Association("Skills").Replace(&skills); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal update skills"})
		return
	}

	config.DB.Save(&user)

	c.JSON(http.StatusOK, gin.H{"message": "Profil berhasil diperbarui", "user": user})
}

type AddPortofolioInput struct {
	Judul     string `json:"judul" binding:"required"`
	LinkAsset string `json:"link_asset" binding:"required"`
}

func AddPortofolio(c *gin.Context) {
	userIDFloat, _ := c.Get("userID")
	userID := uint(userIDFloat.(float64))

	var input AddPortofolioInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	portofolio := models.Portofolio{
		IDUser:    userID,
		Judul:     input.Judul,
		LinkAsset: input.LinkAsset,
	}

	if err := config.DB.Create(&portofolio).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menambah portofolio"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Portofolio berhasil ditambahkan", "portofolio": portofolio})
}
