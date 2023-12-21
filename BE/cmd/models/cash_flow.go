package models

import (
	"time"
)

type CashFlows struct {
	Id        int       `json:"id"`
	PaymentId string    `json:"item,ommitempty"`
	Amount    int32     `json:"amount,ommitempty"`
	TrxId     string    `json:"trx_id,ommitempty"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"-"`
}
