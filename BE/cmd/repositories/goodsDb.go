package repositories

import (
	"eelektronik-echo/cmd/models"
)

func GetGoods() ([]models.Goods, error) {
	var data []models.Goods

	result := db.Find(&data)

	if result.Error != nil {
		return nil, result.Error
	}

	return data, nil
}

func GetPrdCategory() ([]string, error) {
	var data []string

	result := db.Model(&models.Goods{}).Distinct().Pluck("product_category", &data)

	if result.Error != nil {
		return nil, result.Error
	}

	return data, nil
}

func GetBrand() ([]string, error) {
	var data []string

	result := db.Model(&models.Goods{}).Distinct().Pluck("brand", &data)

	if result.Error != nil {
		return nil, result.Error
	}

	return data, nil
}

func CreateUpdateGoods(goods models.Goods) string {
	result := db.Save(&goods)

	if result.Error != nil {
		return "Failed!"
	}
	return "Success!"
}

func DeleteGoods(goods models.Goods) string {
	result := db.Delete(&models.Goods{}, goods.Id)

	if result.Error != nil {
		return "Failed!"
	}
	return "Success!"
}
