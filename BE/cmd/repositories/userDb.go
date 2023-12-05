package repositories

import (
	"eelektronik-echo/cmd/models"
	"eelektronik-echo/cmd/storage"

	"golang.org/x/crypto/bcrypt"
)

var db = storage.InitDB()

func GetUser() ([]models.ActiveUser, error) {
	var data []models.ActiveUser
	result := db.Select("id", "name", "username", "role", "created_at", "updated_at").Find(&data)

	if result.Error != nil {
		return nil, result.Error
	}

	return data, nil
}

func CreateUser(user models.ActiveUser) string {
	hashed, _ := bcrypt.GenerateFromPassword([]byte(user.Password), 14)
	user.Password = string(hashed)
	result := db.Create(&user)

	if result.Error != nil {
		return "Failed!"
	}
	return "Success!"
}

func UpdateUser(user models.ActiveUser) string {
	hashed, _ := bcrypt.GenerateFromPassword([]byte(user.Password), 14)
	user.Password = string(hashed)
	result := db.Model(&user).Where("username = ?", user.Username).Updates(models.ActiveUser{Username: user.Username, Password: user.Password})

	if result.Error != nil {
		return "Failed!"
	}
	return "Success!"
}

func DeleteUser(user models.ActiveUser) string {
	result := db.Delete(&models.ActiveUser{}, user.Id)

	if result.Error != nil {
		return "Failed!"
	}
	return "Success!"
}
