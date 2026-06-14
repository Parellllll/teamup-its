package models

func (Portofolio) TableName() string {
	return "portofolios"
}

type Portofolio struct {
	IDPort    uint   `gorm:"primaryKey;column:id_port" json:"id_port"`
	IDUser    uint   `gorm:"column:id_user" json:"id_user"`
	Judul     string `gorm:"size:255;not null;column:judul" json:"judul"`
	LinkAsset string `gorm:"size:255;column:link_asset" json:"link_asset"`
}
