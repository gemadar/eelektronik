package models

import (
	"time"
)

type Cashes struct {
	Id         int       `json:"id"`
	Amount     int32     `json:"amount,ommitempty"`
	AmountDate string    `json:"amount_date,ommitempty"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"-"`
}
