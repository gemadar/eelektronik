package repositories

import (
	"eelektronik-echo/cmd/models"
	"time"
)

func GetCash() (int32, error) {
	var data models.Cashes

	result := db.Select("amount").Where("amount_date = ?", time.Now().Format("2006-01-02")).Find(&data)

	if result.Error != nil {
		return 0, result.Error
	}

	return data.Amount, nil
}
