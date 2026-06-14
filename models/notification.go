package models

import "time"

func (Notification) TableName() string {
	return "notifikasi"
}

type Notification struct {
	IDNotif    uint      `gorm:"primaryKey;column:id_notif" json:"id_notif"`
	IDUser     uint      `gorm:"column:id_user" json:"id_user"`
	Judul      string    `gorm:"size:255;column:judul" json:"judul"`
	Pesan      string    `gorm:"type:text;column:pesan" json:"pesan"`
	Kategori   string    `gorm:"size:100;column:kategori" json:"kategori"`
	IDTerkait  uint      `gorm:"column:id_terkait" json:"id_terkait"`
	StatusBaca bool      `gorm:"column:status_baca;default:false" json:"status_baca"`
	TglDibuat  time.Time `gorm:"column:tgl_dibuat;autoCreateTime" json:"tgl_dibuat"`
}
