package handlers

import (
	"eelektronik-echo/cmd/models"
	"eelektronik-echo/cmd/repositories"
	"net/http"

	"github.com/labstack/echo/v4"
)

func GetCustomer(c echo.Context) error {
	data, err := repositories.GetCustomer()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}
	return c.JSON(http.StatusFound, data)
}

func CreateUpdateCustomer(c echo.Context) error {
	supp := models.Customers{}

	c.Bind(&supp)
	updatedCustomer := repositories.CreateUpdateCustomer(supp)

	return c.JSON(http.StatusOK, updatedCustomer)
}

func DeleteCustomer(c echo.Context) error {
	supp := models.Customers{}

	c.Bind(&supp)
	updatedCustomer := repositories.DeleteCustomer(supp)

	return c.JSON(http.StatusOK, updatedCustomer)
}
