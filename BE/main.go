package main

import (
	"eelektronik-echo/cmd/handlers"
	"eelektronik-echo/cmd/repositories"
	"eelektronik-echo/cmd/storage"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()
	e.GET("/", handlers.Home)
	storage.InitDB()

	//route for users
	e.GET("/users", handlers.GetUser, handlers.IsLoggedIn, handlers.IsAdmin)
	e.POST("/users", handlers.CreateUser, handlers.IsLoggedIn, handlers.IsAdmin)
	e.POST("/users/update", handlers.HandleUpdateUser, handlers.IsLoggedIn, handlers.IsAdmin)

	//route for suppliers
	e.GET("/supp", handlers.GetSupplier, handlers.IsLoggedIn, handlers.IsAdmin)
	e.POST("/supp", handlers.CreateUpdateSupplier, handlers.IsLoggedIn, handlers.IsAdmin)
	e.POST("/supp/delete", handlers.DeleteSupplier, handlers.IsLoggedIn, handlers.IsAdmin)

	//route for goods
	e.GET("/goods", handlers.GetGood, handlers.IsLoggedIn)
	e.GET("/goods/category", handlers.GetPrdCategory, handlers.IsLoggedIn)
	e.GET("/goods/brand", handlers.GetBrand, handlers.IsLoggedIn)
	e.POST("/goods", handlers.CreateUpdateGood, handlers.IsLoggedIn)
	e.POST("/goods/delete", handlers.DeleteGood, handlers.IsLoggedIn)

	//route for customers
	e.GET("/cust", handlers.GetCustomer, handlers.IsLoggedIn)
	e.POST("/cust", handlers.CreateUpdateCustomer, handlers.IsLoggedIn, handlers.IsAdmin)
	e.POST("/cust/delete", handlers.DeleteCustomer, handlers.IsLoggedIn, handlers.IsAdmin)

	//route for transactions
	e.GET("/trx", handlers.GetTransactions, handlers.IsLoggedIn)
	e.GET("/trx/gen", handlers.GenerateTrxId, handlers.IsLoggedIn)
	e.POST("/trx", handlers.CreateTransactions, handlers.IsLoggedIn)
	e.POST("/trx/update", handlers.UpdateTransactions, handlers.IsLoggedIn)
	e.POST("/trx/delete", handlers.DeleteTrxDetails, handlers.IsLoggedIn)
	e.POST("/trx/pay", handlers.PayTransactions, handlers.IsLoggedIn)

	//route for dashboard
	e.GET("/curr", handlers.GetCash, handlers.IsLoggedIn, handlers.IsAdmin)

	e.POST("/login", handlers.LogIn)
	e.POST("/ref", handlers.Refresh)
	e.POST("/logout", handlers.LogOut)

	//middleware
	e.Use(handlers.LogRequest)
	e.Use(middleware.Logger())

	//CORs
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000", "http://103.190.29.86:3000"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
	}))

	// Clear Expired Logged In User
	repositories.Schedule(repositories.ClearIsLogin, 30*time.Minute)

	e.Logger.Fatal(e.Start(":8080"))
}
