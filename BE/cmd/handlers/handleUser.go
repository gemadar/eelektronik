package handlers

import (
	"eelektronik-echo/cmd/models"
	"eelektronik-echo/cmd/repositories"
	"net/http"

	"github.com/labstack/echo/v4"
)

func GetUser(c echo.Context) error {
	data, err := repositories.GetUser()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}
	return c.JSON(http.StatusFound, data)
}

func CreateUser(c echo.Context) error {
	user := models.ActiveUser{}
	c.Bind(&user)
	newUser := repositories.CreateUser(user)

	return c.JSON(http.StatusCreated, newUser)
}

func HandleUpdateUser(c echo.Context) error {
	user := models.ActiveUser{}

	c.Bind(&user)
	updatedUser := repositories.UpdateUser(user)

	return c.JSON(http.StatusOK, updatedUser)
}
