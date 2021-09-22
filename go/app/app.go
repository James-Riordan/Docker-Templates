package app

import (
	"database/sql"
	"fmt"
	"log"
	"main/app/router"

	_ "github.com/lib/pq"
)

type App struct {
	DB *sql.DB
}

const (
	HOST = "db"
	PORT = 5432
)

func (a *App) Initialize(user, password, dbname string) {
	connectionString :=
		fmt.Sprintf("host=%s port=%d  user=%s password=%s dbname=%s sslmode=disable", HOST, PORT, user, password, dbname)

	//fmt.Println(user, password, dbname)
	var err error
	a.DB, err = sql.Open("postgres", connectionString)
	if err != nil {
		log.Fatal(err)
	}

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

func (a *App) Run() {
	router.Initialize()
}
