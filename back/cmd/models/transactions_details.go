package models

import (
	"time"
)

type TransactionsDetails struct {
	Id        int       `json:"id"`
	Item      string    `json:"item,ommitempty"`
	Quantity  int       `json:"quantity,ommitempty"`
	Price     int       `json:"price,ommitempty"`
	TrxId     string    `json:"trx_id,ommitempty"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"-"`
}
