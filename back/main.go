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
	api := e.Group("/back")
	storage.InitDB()

	//home route
	api.GET("/", handlers.Home)

	//route for users
	api.GET("/users", handlers.GetUser, handlers.IsLoggedIn, handlers.IsAdmin)
	api.POST("/users", handlers.CreateUser)
	api.POST("/users/update", handlers.HandleUpdateUser, handlers.IsLoggedIn, handlers.IsAdmin)

	//route for suppliers
	api.GET("/supp", handlers.GetSupplier, handlers.IsLoggedIn, handlers.IsAdmin)
	api.POST("/supp", handlers.CreateUpdateSupplier, handlers.IsLoggedIn, handlers.IsAdmin)
	api.POST("/supp/delete", handlers.DeleteSupplier, handlers.IsLoggedIn, handlers.IsAdmin)

	//route for goods
	api.GET("/goods", handlers.GetGood, handlers.IsLoggedIn)
	api.GET("/goods/category", handlers.GetPrdCategory, handlers.IsLoggedIn)
	api.GET("/goods/brand", handlers.GetBrand, handlers.IsLoggedIn)
	api.POST("/goods", handlers.CreateUpdateGood, handlers.IsLoggedIn)
	api.POST("/goods/delete", handlers.DeleteGood, handlers.IsLoggedIn)

	//route for customers
	api.GET("/cust", handlers.GetCustomer, handlers.IsLoggedIn)
	api.POST("/cust", handlers.CreateUpdateCustomer, handlers.IsLoggedIn, handlers.IsAdmin)
	api.POST("/cust/delete", handlers.DeleteCustomer, handlers.IsLoggedIn, handlers.IsAdmin)

	//route for transactions
	api.GET("/trx", handlers.GetTransactions, handlers.IsLoggedIn)
	api.GET("/trx/gen", handlers.GenerateTrxId, handlers.IsLoggedIn)
	api.POST("/trx", handlers.CreateTransactions, handlers.IsLoggedIn)
	api.POST("/trx/update", handlers.UpdateTransactions, handlers.IsLoggedIn)
	api.POST("/trx/delete", handlers.DeleteTrxDetails, handlers.IsLoggedIn)
	api.POST("/trx/pay", handlers.PayTransactions, handlers.IsLoggedIn)

	//route for dashboard
	api.GET("/curr", handlers.GetCash, handlers.IsLoggedIn, handlers.IsAdmin)

	api.POST("/login", handlers.LogIn)
	api.POST("/ref", handlers.Refresh)
	api.POST("/logout", handlers.LogOut)

	//middleware
	e.Use(handlers.LogRequest)
	e.Use(middleware.Logger())

	//CORs
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
	}))

	// Clear Expired Logged In User
	repositories.Schedule(repositories.ClearIsLogin, 30*time.Minute)

	e.Logger.Fatal(e.Start(":8080"))
}
