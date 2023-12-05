package models

import (
	"time"
)

type Customers struct {
	Id           int            `json:"id"`
	Name         string         `json:"name,ommitempty"`
	Address      string         `json:"address,ommitempty"`
	Gender       string         `json:"gender"`
	DOB          string         `json:"dob,ommitempty"`
	PhoneNumber  string         `json:"phone,ommitempty"`
	Email        string         `json:"email,ommitempty"`
	Transactions []Transactions `gorm:"foreignKey:cst_id;references:id"`
	CreatedAt    time.Time      `json:"-"`
	UpdatedAt    time.Time      `json:"-"`
}
