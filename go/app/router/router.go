package router

import (
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func Initialize() {
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})
	PORT, exists := os.LookupEnv("PORT")
	if !exists {
		PORT = ":8000"
	}
	e.Logger.Fatal(e.Start(PORT))
}
