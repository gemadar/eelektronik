package models

import (
	"time"
)

type Goods struct {
	Id              int       `json:"id"`
	Name            string    `json:"name,ommitempty"`
	ProductCode     string    `json:"prd_code,ommitempty"`
	Brand           string    `json:"brand,ommitempty"`
	ProductCategory string    `json:"prd_category,ommitempty"`
	BuyPrice        int       `json:"buy_price,ommitempty"`
	SellPrice       int       `json:"sell_price,ommitempty"`
	Quantity        int32     `json:"quantity,ommitempty"`
	SupplierId      int32     `json:"supplier_id,ommitempty"`
	SupplierName    string    `json:"supplier_name,ommitempty"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}
