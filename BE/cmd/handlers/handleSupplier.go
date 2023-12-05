package handlers

import (
	"eelektronik-echo/cmd/models"
	"eelektronik-echo/cmd/repositories"
	"net/http"

	"github.com/labstack/echo/v4"
)

func GetSupplier(c echo.Context) error {
	data, err := repositories.GetSupplier()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}
	return c.JSON(http.StatusFound, data)
}

func CreateUpdateSupplier(c echo.Context) error {
	supp := models.Suppliers{}

	c.Bind(&supp)
	updatedSupplier := repositories.CreateUpdateSupplier(supp)

	return c.JSON(http.StatusOK, updatedSupplier)
}

func DeleteSupplier(c echo.Context) error {
	supp := models.Suppliers{}

	c.Bind(&supp)
	updatedSupplier := repositories.DeleteSupplier(supp)

	return c.JSON(http.StatusOK, updatedSupplier)
}
