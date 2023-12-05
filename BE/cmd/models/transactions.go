package models

import (
	"time"
)

type Transactions struct {
	Id                  int                   `json:"id"`
	TrxId               string                `json:"trx_id,ommitempty"`
	CstId               int8                  `json:"cst_id,ommitempty"`
	CstName             string                `json:"cst_name,ommitempty"`
	Total               int32                 `json:"total,ommitempty"`
	PaymentType         string                `json:"payment_type,ommitempty"`
	Status              string                `json:"status,ommitempty"`
	TransactionsDetails []TransactionsDetails `gorm:"foreignKey:trx_id;references:trx_id"`
	CreatedAt           time.Time             `json:"created_at"`
	UpdatedAt           time.Time             `json:"-"`
}
