#!/bin/bash

# Maximum number of retries
MAX_RETRIES=30
RETRY_COUNT=0

echo "Starting database connection check..."
echo "Database Host: $DB_HOST"
echo "Database Name: $DB_NAME"
echo "Database Port: ${DB_PORT:-5432}"

# Wait for database to be ready
until PGPASSWORD=$DB_PASS psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c '\q' 2>/dev/null; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo "Error: Maximum retry count ($MAX_RETRIES) reached. Database is not available."
        echo "Please check your database configuration and ensure the database service is running."
        exit 1
    fi
    echo "Waiting for database... (Attempt $RETRY_COUNT of $MAX_RETRIES)"
    sleep 2
done

echo "Database connection successful!"

# Run database migrations
echo "Running database migrations..."
php database/migrate.php

# Start Apache
echo "Starting Apache..."
apache2-foreground 