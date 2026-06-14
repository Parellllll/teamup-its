package controllers

import (
	"net/http"
	"strings"
	"teamup/config"
	"teamup/models"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var jwtSecret = []byte("super-secret-key-change-this") // Ideally from env

type RegisterInput struct {
	Name           string   `json:"name" binding:"required"`
	Email          string   `json:"email" binding:"required,email"`
	Password       string   `json:"password" binding:"required,min=6"`
	Department     string   `json:"department"`
	GraduationYear int      `json:"graduation_year"`
	Bio            string   `json:"bio"`
	Skills         []string `json:"skills"`
}

func Register(c *gin.Context) {
	var input RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if !strings.HasSuffix(input.Email, "its.ac.id") {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Hanya email ITS (@its.ac.id / @student.its.ac.id) yang diperbolehkan."})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	user := models.User{
		Nama:       input.Name,
		Email:      input.Email,
		Password:   string(hashedPassword),
		Departemen: input.Department,
		Angkatan:   input.GraduationYear,
		Bio:        input.Bio,
	}

	if err := config.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat user atau email sudah terdaftar"})
		return
	}

	// Process skills if any
	if len(input.Skills) > 0 {
		var skills []models.Skill
		for _, skillName := range input.Skills {
			if skillName == "" {
				continue
			}
			var skill models.Skill
			config.DB.FirstOrCreate(&skill, models.Skill{NamaSkill: skillName, Kategori: "Lainnya"})
			skills = append(skills, skill)
		}
		if len(skills) > 0 {
			config.DB.Model(&user).Association("Skills").Append(&skills)
		}
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Registrasi berhasil", "user": user})
}

type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func Login(c *gin.Context) {
	var input LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := config.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Kredensial tidak valid"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Kredensial tidak valid"})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.IDUser,
		"exp": time.Now().Add(time.Hour * 72).Unix(),
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghasilkan token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login berhasil",
		"token":   tokenString,
		"user":    user,
	})
}
