package models

import "time"

func (Application) TableName() string {
	return "applications"
}

type Application struct {
	IDApp     uint      `gorm:"primaryKey;column:id_app" json:"id_app"`
	IDUser    uint      `gorm:"column:id_user" json:"id_user"`
	IDPos     uint      `gorm:"column:id_pos" json:"id_pos"`
	TglDaftar time.Time `gorm:"column:tgl_daftar;autoCreateTime" json:"tgl_daftar"`
	Status    string    `gorm:"size:50;column:status;default:'Pending'" json:"status"`

	// Relationships
	User     *User     `gorm:"foreignKey:IDUser;references:IDUser" json:"user,omitempty"`
	Position *Position `gorm:"foreignKey:IDPos;references:IDPos" json:"position,omitempty"`
}
