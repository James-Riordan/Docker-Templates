package main

import (
	"log"
	"main/app"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	user := os.Getenv("APP_DB_USERNAME")
	password := os.Getenv("APP_DB_PASSWORD")
	dbname := os.Getenv("APP_DB_NAME")

	//a := App{}
	a := app.App{}
	a.Initialize(user, password, dbname)
	a.Run()
}
