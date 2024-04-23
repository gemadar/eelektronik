package handlers

import (
	"eelektronik-echo/cmd/models"
	"eelektronik-echo/cmd/repositories"
	"net/http"

	"github.com/labstack/echo/v4"
)

func GetGood(c echo.Context) error {
	data, err := repositories.GetGoods()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}
	return c.JSON(http.StatusFound, data)
}

func GetPrdCategory(c echo.Context) error {
	data, err := repositories.GetPrdCategory()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}
	return c.JSON(http.StatusFound, data)
}

func GetBrand(c echo.Context) error {
	data, err := repositories.GetBrand()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}
	return c.JSON(http.StatusFound, data)
}

func CreateUpdateGood(c echo.Context) error {
	Good := models.Goods{}

	c.Bind(&Good)
	updatedGood := repositories.CreateUpdateGoods(Good)

	return c.JSON(http.StatusOK, updatedGood)
}

func DeleteGood(c echo.Context) error {
	goods := models.Goods{}

	c.Bind(&goods)
	updatedCustomer := repositories.DeleteGoods(goods)

	return c.JSON(http.StatusOK, updatedCustomer)
}
