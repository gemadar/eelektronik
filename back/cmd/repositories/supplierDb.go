package repositories

import (
	"eelektronik-echo/cmd/models"
)

func GetSupplier() ([]models.Suppliers, error) {
	var data []models.Suppliers

	result := db.Preload("Goods").Find(&data)

	if result.Error != nil {
		return nil, result.Error
	}

	return data, nil
}

func CreateUpdateSupplier(supp models.Suppliers) string {
	result := db.Save(&supp)

	if result.Error != nil {
		return "Failed!"
	}
	return "Success!"
}

func DeleteSupplier(supp models.Suppliers) string {
	result := db.Delete(&models.Suppliers{}, supp.Id)

	if result.Error != nil {
		return "Failed!"
	}
	return "Success!"
}
