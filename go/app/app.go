package app

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

type App struct {
	Router *mux.Router
	DB     *sql.DB
}

func (a *App) Initialize(user, password, dbname string) {
	connectionString :=
		fmt.Sprintf("user=%s password=%s dbname=%s sslmode=disable", user, password, dbname)

	//fmt.Println(user, password, dbname)
	var err error
	a.DB, err = sql.Open("postgres", connectionString)
	if err != nil {
		log.Fatal(err)
	}

	a.Router = mux.NewRouter()
	a.ensureTablesExist()
}

func (a *App) ensureTablesExist() {
	const tableCreationQuery = `CREATE TABLE IF NOT EXISTS items
(
    id SERIAL,
    name TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    CONSTRAINT items_pkey PRIMARY KEY (id)
)`
	if _, err := a.DB.Exec(tableCreationQuery); err != nil {
		log.Fatal(err)
	}

}

func (a *App) Run(addr string) {
	log.Fatal(http.ListenAndServe(":8010", nil))
}
