package models

import (
	"time"
)

type Suppliers struct {
	Id          int       `json:"id"`
	Name        string    `json:"name,ommitempty"`
	Address     string    `json:"address,ommitempty"`
	PIC         string    `json:"pic"`
	PhoneNumber string    `json:"phone"`
	Goods       []Goods   `gorm:"foreignKey:supplier_id;references:id"`
	CreatedAt   time.Time `json:"-"`
	UpdatedAt   time.Time `json:"-"`
}
