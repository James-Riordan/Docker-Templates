package main

import (
	"fmt"
	"log"
	"main/app"
	"net/http"
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
	r := a.Router
	r.HandleFunc("/", HomeHandler)
	r.HandleFunc("/products", ProductsHandler)
	r.HandleFunc("/articles", ArticlesHandler)
	http.Handle("/", r)
	a.Run(":8010")
}

func HomeHandler(w http.ResponseWriter, req *http.Request) {
	fmt.Fprintf(w, "hello\n")
}

func ProductsHandler(w http.ResponseWriter, req *http.Request) {
	fmt.Fprintf(w, "products\n")
}

func ArticlesHandler(w http.ResponseWriter, req *http.Request) {
	fmt.Fprintf(w, "articles\n")
}
