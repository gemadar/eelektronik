package handlers

import (
	"eelektronik-echo/cmd/models"
	"eelektronik-echo/cmd/repositories"
	"net/http"

	"github.com/labstack/echo/v4"
)

func LogIn(c echo.Context) error {
	user := models.ActiveUser{}
	c.Bind(&user)

	str, err := repositories.LogIn(user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusAccepted, map[string]any{"token": str[0], "rtoken": str[1]})
}

func Refresh(c echo.Context) error {
	Req := models.Req{}
	c.Bind(&Req)
	str, err := repositories.Refresh(Req.Rt)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}

	if str == nil {
		return c.JSON(http.StatusAccepted, nil)
	}

	return c.JSON(http.StatusAccepted, map[string]any{"token": str[0], "rtoken": str[1]})
}

func LogOut(c echo.Context) error {
	user := models.ActiveUser{}
	c.Bind(&user)

	str := repositories.LogOut(user)

	return c.JSON(http.StatusAccepted, str)
}
