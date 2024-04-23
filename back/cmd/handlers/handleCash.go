package handlers

import (
	"eelektronik-echo/cmd/repositories"
	"net/http"

	"github.com/labstack/echo/v4"
)

func GetCash(c echo.Context) error {
	data, err := repositories.GetCash()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}
	return c.JSON(http.StatusFound, data)
}
