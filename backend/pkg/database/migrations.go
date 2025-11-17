package database

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
)

// RunMigrations executes SQL migration files
func RunMigrations() error {
	if DB == nil {
		return fmt.Errorf("database connection not initialized")
	}

	// Read the schema file
	schemaPath := filepath.Join("..", "..", "database-setup", "schema.sql")
	schemaSQL, err := os.ReadFile(schemaPath)
	if err != nil {
		// Try alternative path
		schemaPath = filepath.Join("database-setup", "schema.sql")
		schemaSQL, err = os.ReadFile(schemaPath)
		if err != nil {
			return fmt.Errorf("unable to read schema file: %w", err)
		}
	}

	// Execute the schema
	_, err = DB.Exec(context.Background(), string(schemaSQL))
	if err != nil {
		return fmt.Errorf("unable to execute schema: %w", err)
	}

	return nil
}

