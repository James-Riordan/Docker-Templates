package main

import (
	"database/sql"
	"errors"
)

type item struct {
	ID    int     `json:"id"`
	Name  string  `json:"name"`
	Price float64 `json:"price"`
}

func (p *item) getItem(db *sql.DB) error {
	return errors.New("Not implemented")
}

func (p *item) updateItem(db *sql.DB) error {
	return errors.New("Not implemented")
}

func (p *item) deleteItem(db *sql.DB) error {
	return errors.New("Not implemented")
}

func (p *item) createItem(db *sql.DB) error {
	return errors.New("Not implemented")
}

func getitems(db *sql.DB, start, count int) ([]item, error) {
	return nil, errors.New("Not implemented")
}
