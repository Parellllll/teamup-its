package models

import "time"

func (RecruitmentPost) TableName() string {
	return "recruitment_posts"
}

func (Position) TableName() string {
	return "positions"
}

type RecruitmentPost struct {
	IDPost    uint       `gorm:"primaryKey;column:id_post" json:"id_post"`
	IDUser    uint       `gorm:"column:id_user" json:"id_user"`
	Judul     string     `gorm:"size:255;not null;column:judul" json:"judul"`
	Deskripsi string     `gorm:"type:text;column:deskripsi" json:"deskripsi"`
	TglDibuat time.Time  `gorm:"column:tgl_dibuat;autoCreateTime" json:"tgl_dibuat"`
	TglTutup  time.Time  `gorm:"column:tgl_tutup" json:"tgl_tutup"`

	// Relationships
	Positions []Position `gorm:"foreignKey:IDPost;references:IDPost" json:"positions"`
	User      *User      `gorm:"foreignKey:IDUser;references:IDUser" json:"user,omitempty"`
}

type Position struct {
	IDPos    uint    `gorm:"primaryKey;column:id_pos" json:"id_pos"`
	IDPost   uint    `gorm:"column:id_post" json:"id_post"`
	NamaPos  string  `gorm:"size:255;not null;column:nama_pos" json:"nama_pos"`
	Kuota    int     `gorm:"column:kuota;default:1" json:"kuota"`
	Status   string  `gorm:"size:50;column:status;default:'Buka'" json:"status"`

	// Relationships
	Skills []Skill `gorm:"many2many:position_skills;joinForeignKey:id_pos;joinReferences:id_skill" json:"skills"`
}
