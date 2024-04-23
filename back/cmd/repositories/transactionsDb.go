package repositories

import (
	"eelektronik-echo/cmd/models"
	"fmt"
	"math/rand"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func WordsGen(digit int) string {
	const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789"

	b := make([]byte, digit)
	for i := range b {
		b[i] = letterBytes[rand.Intn(len(letterBytes))]
	}
	return string(b)
}

func padNumberWithZero(value int) string {
	return fmt.Sprintf("%05d", value)
}

func GenerateTrxId() string {
	var data string
	var trx string

	t := strings.ReplaceAll(time.Now().Format("01-02-06"), "-", "")
	c := db.Model(models.Transactions{}).Select("trx_id").Where("trx_id LIKE ?", t+"%").Last(&data)
	if c.RowsAffected != 0 {
		newTrx, _ := strconv.Atoi(strings.TrimLeft(data[9:14], "0"))

		trx = data[0:6] + WordsGen(3) + padNumberWithZero((newTrx + 1))
	} else {
		trx = t + WordsGen(3) + "00001"
	}

	return trx
}

func GetTransactions() ([]models.Transactions, error) {
	var data []models.Transactions

	result := db.Preload("TransactionsDetails").Find(&data)
	if result.Error != nil {
		return nil, result.Error
	}

	return data, nil
}

func CreateTransactions(trx models.Transactions) string {
	result1 := db.Create(&trx)

	if result1.Error != nil {
		return "Failed!"
	}
	return "Success!"
}

func UpdateTransactions(trx models.Transactions) string {
	result := db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&models.Transactions{}).Where("trx_id = ?", trx.TrxId).Updates(models.Transactions{PaymentType: trx.PaymentType, Total: trx.Total, CstId: trx.CstId, CstName: trx.CstName}).Error; err != nil {
			return err
		}

		for i := range trx.TransactionsDetails {
			if trx.TransactionsDetails[i].Id != 0 {
				if err := tx.Model(&models.TransactionsDetails{}).Where("id = ?", trx.TransactionsDetails[i].Id).Updates(models.TransactionsDetails{Quantity: trx.TransactionsDetails[i].Quantity, Price: trx.TransactionsDetails[i].Price}).Error; err != nil {
					return err
				}
			} else {
				if err := tx.Create(&trx.TransactionsDetails[i]).Error; err != nil {
					return err
				}
			}
		}

		return nil
	})

	if result != nil {
		return "Failed!"
	}

	return "Success!"
}

func DeleteTrxDetails(trxDetails models.TransactionsDetails) string {
	result := db.Delete(&models.TransactionsDetails{}, trxDetails.Id)

	if result.Error != nil {
		return "Failed!"
	}
	return "Success!"
}

func PayTrx(trx models.Transactions) string {
	var pay models.CashFlows
	var cash models.Cashes
	uuid := uuid.NewString()

	pay.TrxId = trx.TrxId
	pay.PaymentId = uuid
	pay.Amount = trx.Total

	result := db.Transaction(func(tx *gorm.DB) error {
		var goods models.Goods
		// Update Trx Status
		if err := tx.Model(&models.Transactions{}).Where("trx_id = ?", trx.TrxId).Update("status", "paid").Error; err != nil {
			return err
		}

		// Update Stock
		for i := range trx.TransactionsDetails {
			if err := tx.Model(&models.Goods{}).Where("name = ?", trx.TransactionsDetails[i].Item).Select("quantity").Find(&goods); err.Error != nil {
				return err.Error
			}

			if err := tx.Model(&models.Goods{}).Where("name = ?", trx.TransactionsDetails[i].Item).Update("quantity", goods.Quantity-int32(trx.TransactionsDetails[i].Quantity)).Error; err != nil {
				return err
			}
		}

		// Add to Cashflow
		if err := tx.Create(&pay).Error; err != nil {
			return err
		}

		// Update current balance
		c := db.Model(models.Cashes{}).Select("amount").Where("amount_date = ?", time.Now().Format("2006-01-02")).Find(&cash)
		if c.RowsAffected != 0 {
			if err := tx.Model(&models.Cashes{}).Where("amount_date = ?", time.Now().Format("2006-01-02")).Update("amount", cash.Amount+trx.Total).Error; err != nil {
				return err
			}
		} else {
			cash.Amount = trx.Total
			cash.AmountDate = time.Now().Format("2006-01-02")
			if err := tx.Create(&cash).Error; err != nil {
				return err
			}
		}

		return nil
	})

	if result != nil {
		return "Failed!"
	}
	return "Success!"
}
