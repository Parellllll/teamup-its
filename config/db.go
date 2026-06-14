package config

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"github.com/joho/godotenv"
)

var DB *gorm.DB

func ConnectDB() {
	_ = godotenv.Load()

	dbUrl := os.Getenv("DATABASE_URL")
	if dbUrl != "" {
		db, err := gorm.Open(mysql.Open(dbUrl), &gorm.Config{})
		if err != nil {
			log.Fatal("Failed to connect to database using DATABASE_URL:", err)
		}
		DB = db
		fmt.Println("Database connected successfully via DATABASE_URL")
		return
	}

	dbUser := os.Getenv("DB_USER")
	if dbUser == "" {
		dbUser = "root"
	}
	dbPass := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		dbHost = "127.0.0.1"
	}
	dbPort := os.Getenv("DB_PORT")
	if dbPort == "" {
		dbPort = "3306"
	}
	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "teamup"
	}

	// First connect without dbname to create the database if it doesn't exist
	dsnBase := fmt.Sprintf("%s:%s@tcp(%s:%s)/?charset=utf8mb4&parseTime=True&loc=Local", dbUser, dbPass, dbHost, dbPort)
	dbBase, err := gorm.Open(mysql.Open(dsnBase), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to MySQL server:", err)
	}

	createDBQuery := fmt.Sprintf("CREATE DATABASE IF NOT EXISTS `%s`;", dbName)
	if err := dbBase.Exec(createDBQuery).Error; err != nil {
		log.Fatal("Failed to create database:", err)
	}

	// Now connect to the specific database
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", dbUser, dbPass, dbHost, dbPort, dbName)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	DB = db
	fmt.Println("Database connected successfully")
}
