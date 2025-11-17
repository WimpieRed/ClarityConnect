package database

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var DB *pgxpool.Pool

// InitDB initializes the database connection pool
func InitDB() error {
	// Load .env file if it exists
	godotenv.Load()

	connString := os.Getenv("DATABASE_URL")
	if connString == "" {
		// Default connection string for local development
		connString = "postgresql://postgres:postgres@localhost:5432/clarityconnect?sslmode=disable"
	}

	config, err := pgxpool.ParseConfig(connString)
	if err != nil {
		return fmt.Errorf("unable to parse database config: %w", err)
	}

	DB, err = pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		return fmt.Errorf("unable to create connection pool: %w", err)
	}

	// Test the connection
	if err := DB.Ping(context.Background()); err != nil {
		return fmt.Errorf("unable to ping database: %w", err)
	}

	return nil
}

// CloseDB closes the database connection pool
func CloseDB() {
	if DB != nil {
		DB.Close()
	}
}

