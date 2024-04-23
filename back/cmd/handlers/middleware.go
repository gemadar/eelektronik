package handlers

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
)

var key = os.Getenv("JWT_SECRET")

func LogRequest(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		start := time.Now()
		err := next(c)
		stop := time.Now()
		fmt.Printf("Request: %s %s %s\n", c.Request().Method, c.Request().URL, stop.Sub(start))
		return err
	}
}

var IsLoggedIn = echojwt.WithConfig(echojwt.Config{
	SigningKey: []byte(key),
})

func IsAdmin(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		user := c.Get("user").(*jwt.Token)
		claims := user.Claims.(jwt.MapClaims)
		role := claims["role"].(string)

		if role != "admin" {
			return echo.ErrUnauthorized
		}

		return next(c)
	}
}
