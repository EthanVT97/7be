#!/bin/bash

# Wait for database to be ready
until php public/api/test/database.php > /dev/null 2>&1; do
  echo "Waiting for database..."
  sleep 2
done

# Run database migrations
php database/migrate.php

# Start Apache
apache2-foreground 