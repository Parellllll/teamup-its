package controllers

import (
	"net/http"
	"teamup/config"
	"teamup/models"
	"time"

	"github.com/gin-gonic/gin"
)

type PositionInput struct {
	NamaPos string   `json:"nama_pos" binding:"required"`
	Kuota   int      `json:"kuota" binding:"required,min=1"`
	Skills  []string `json:"required_skills"`
}

type CreatePostInput struct {
	Judul     string          `json:"judul" binding:"required"`
	Deskripsi string          `json:"deskripsi" binding:"required"`
	TglTutup  time.Time       `json:"tgl_tutup" binding:"required"`
	Positions []PositionInput `json:"positions" binding:"required,min=1"`
}

func CreatePost(c *gin.Context) {
	userIDFloat, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := uint(userIDFloat.(float64))

	var input CreatePostInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// We can use the stored procedure 'sp_create_recruitment_post', but we need to insert positions too.
	// We'll use GORM transaction for simplicity and to handle the nested positions and skills.
	tx := config.DB.Begin()

	post := models.RecruitmentPost{
		IDUser:    userID,
		Judul:     input.Judul,
		Deskripsi: input.Deskripsi,
		TglTutup:  input.TglTutup,
	}

	if err := tx.Create(&post).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat postingan"})
		return
	}

	for _, posInput := range input.Positions {
		position := models.Position{
			IDPost:  post.IDPost,
			NamaPos: posInput.NamaPos,
			Kuota:   posInput.Kuota,
			Status:  "Buka",
		}

		if err := tx.Create(&position).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat posisi"})
			return
		}

		// Process required skills
		var skills []models.Skill
		for _, skillName := range posInput.Skills {
			var skill models.Skill
			tx.FirstOrCreate(&skill, models.Skill{NamaSkill: skillName, Kategori: "Lainnya"})
			skills = append(skills, skill)
		}

		if len(skills) > 0 {
			if err := tx.Model(&position).Association("Skills").Append(&skills); err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghubungkan skill dengan posisi"})
				return
			}
		}
	}

	tx.Commit()

	c.JSON(http.StatusCreated, gin.H{
		"message": "Postingan rekrutmen berhasil dibuat",
		"post_id": post.IDPost,
	})
}

func GetPosts(c *gin.Context) {
	status := c.Query("status")
	
	query := config.DB.Preload("Positions").Preload("Positions.Skills")
	
	now := time.Now()
	if status == "Buka" {
		query = query.Where("tgl_tutup >= ?", now)
	} else if status == "Tutup" {
		query = query.Where("tgl_tutup < ?", now)
	}

	var posts []models.RecruitmentPost
	if err := query.Find(&posts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data postingan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"posts": posts})
}

func GetMyPosts(c *gin.Context) {
	userIDFloat, _ := c.Get("userID")
	userID := uint(userIDFloat.(float64))

	var posts []models.RecruitmentPost
	if err := config.DB.Preload("Positions").Preload("Positions.Skills").Where("id_user = ?", userID).Order("tgl_dibuat desc").Find(&posts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil postingan saya"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"posts": posts})
}

func GetPostDetails(c *gin.Context) {
	postID := c.Param("id")
	var post models.RecruitmentPost
	if err := config.DB.Preload("User").Preload("Positions").Preload("Positions.Skills").First(&post, postID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Postingan tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"post": post})
}

func DeletePost(c *gin.Context) {
	userIDFloat, _ := c.Get("userID")
	userID := uint(userIDFloat.(float64))

	postID := c.Param("id")
	var post models.RecruitmentPost

	if err := config.DB.First(&post, postID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Postingan tidak ditemukan"})
		return
	}

	if post.IDUser != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Anda tidak berhak menghapus postingan ini"})
		return
	}

	config.DB.Delete(&post)
	c.JSON(http.StatusOK, gin.H{"message": "Postingan berhasil dihapus"})
}
