package models

import "time"

// Tablename mapping for GORM
func (User) TableName() string {
	return "users"
}

func (Skill) TableName() string {
	return "skills"
}

type User struct {
	IDUser     uint         `gorm:"primaryKey;column:id_user" json:"id_user"`
	Email      string       `gorm:"size:255;unique;not null;column:email" json:"email"`
	Nama       string       `gorm:"size:255;not null;column:nama" json:"nama"`
	Password   string       `gorm:"size:255;not null;column:password" json:"-"`
	Departemen string       `gorm:"size:255;column:departemen" json:"departemen"`
	Angkatan   int          `gorm:"column:angkatan" json:"angkatan"`
	Bio        string       `gorm:"type:text;column:bio" json:"bio"`
	CreatedAt  time.Time    `gorm:"column:created_at;autoCreateTime" json:"created_at"`
	
	// Relationships
	Skills      []Skill      `gorm:"many2many:user_skills;joinForeignKey:id_user;joinReferences:id_skill" json:"skills"`
	Portofolios []Portofolio `gorm:"foreignKey:IDUser;references:IDUser" json:"portofolios"`
}

type Skill struct {
	IDSkill   uint   `gorm:"primaryKey;column:id_skill" json:"id_skill"`
	NamaSkill string `gorm:"size:255;not null;column:nama_skill" json:"nama_skill"`
	Kategori  string `gorm:"size:100;column:kategori" json:"kategori"`
}
