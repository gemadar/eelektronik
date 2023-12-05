package repositories

import (
	"eelektronik-echo/cmd/models"
)

func GetCustomer() ([]models.Customers, error) {
	var data []models.Customers

	result := db.Preload("Transactions").Find(&data)
	if result.Error != nil {
		return nil, result.Error
	}

	return data, nil
}

func CreateUpdateCustomer(cust models.Customers) string {
	result := db.Save(&cust)

	if result.Error != nil {
		return "Failed!"
	}
	return "Success!"
}

func DeleteCustomer(cust models.Customers) string {
	result := db.Delete(&models.Customers{}, cust.Id)

	if result.Error != nil {
		return "Failed!"
	}
	return "Success!"
}
