package handlers

import (
	"eelektronik-echo/cmd/models"
	"eelektronik-echo/cmd/repositories"
	"net/http"

	"github.com/labstack/echo/v4"
)

func GetTransactions(c echo.Context) error {
	data, err := repositories.GetTransactions()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}
	return c.JSON(http.StatusFound, data)
}

func GenerateTrxId(c echo.Context) error {
	data := repositories.GenerateTrxId()

	return c.JSON(http.StatusFound, data)
}

func CreateTransactions(c echo.Context) error {
	trx := models.Transactions{}

	c.Bind(&trx)

	createdTransaction := repositories.CreateTransactions(trx)

	return c.JSON(http.StatusOK, createdTransaction)
}

func UpdateTransactions(c echo.Context) error {
	trx := models.Transactions{}

	c.Bind(&trx)

	updatedTransaction := repositories.UpdateTransactions(trx)

	return c.JSON(http.StatusOK, updatedTransaction)
}

func DeleteTrxDetails(c echo.Context) error {
	trxDetails := models.TransactionsDetails{}

	c.Bind(&trxDetails)
	updatedTransaction := repositories.DeleteTrxDetails(trxDetails)

	return c.JSON(http.StatusOK, updatedTransaction)
}

func PayTransactions(c echo.Context) error {
	trx := models.Transactions{}

	c.Bind(&trx)
	updatedTransaction := repositories.PayTrx(trx)

	return c.JSON(http.StatusOK, updatedTransaction)
}
