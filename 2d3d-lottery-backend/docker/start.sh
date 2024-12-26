#!/bin/bash
set -e

# Function to log messages
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Function to check database connection
check_db() {
    local retries=$1
    local count=0
    local wait_time=2

    log "Starting database connection check..."
    log "Database Host: $DB_HOST"
    log "Database Name: $DB_NAME"
    log "Database Port: ${DB_PORT:-5432}"
    log "SSL Mode: require"

    until PGPASSWORD=$DB_PASS psql "host=$DB_HOST port=${DB_PORT:-5432} dbname=$DB_NAME user=$DB_USER sslmode=require" -c '\q' 2>/dev/null; do
        count=$((count + 1))
        if [ $count -ge $retries ]; then
            log "Error: Maximum retry count ($retries) reached. Database is not available."
            log "Please check your database configuration and ensure the database service is running."
            log "Attempting final connection with debug output..."
            PGPASSWORD=$DB_PASS psql "host=$DB_HOST port=${DB_PORT:-5432} dbname=$DB_NAME user=$DB_USER sslmode=require" -c '\q'
            return 1
        fi
        log "Waiting for database... (Attempt $count of $retries)"
        sleep $wait_time
        wait_time=$((wait_time * 2))
    done

    log "Database connection successful!"
    return 0
}

# Function to run migrations
run_migrations() {
    log "Running database migrations..."
    if php database/migrate.php; then
        log "Migrations completed successfully!"
        return 0
    else
        log "Warning: Database migrations failed!"
        return 1
    fi
}

# Function to check Redis connection
check_redis() {
    log "Checking Redis connection..."
    if redis-cli -h ${REDIS_HOST:-localhost} -p ${REDIS_PORT:-6379} ping > /dev/null; then
        log "Redis connection successful!"
        return 0
    else
        log "Warning: Redis connection failed!"
        return 1
    fi
}

# Function to optimize PHP for production
optimize_php() {
    log "Optimizing PHP for production..."
    
    # Clear existing optimizations
    rm -f /tmp/opcache.blacklist
    
    # Optimize Opcache
    if [ "${APP_ENV}" = "production" ]; then
        php -r "opcache_reset();" || true
        log "Opcache reset completed"
    fi
    
    # Set proper permissions
    chown -R www-data:www-data /var/www/html/storage
    chmod -R 755 /var/www/html/storage
    log "File permissions updated"
}

# Main execution
main() {
    # Initialize services
    log "Initializing services..."
    
    # Check database
    if ! check_db 30; then
        log "Fatal: Database initialization failed"
        exit 1
    fi
    
    # Run migrations
    if ! run_migrations; then
        log "Warning: Proceeding despite migration failure"
    fi
    
    # Check Redis
    if ! check_redis; then
        log "Warning: Redis is not available"
    fi
    
    # Optimize PHP
    optimize_php
    
    # Start Apache
    log "Starting Apache..."
    exec apache2-foreground
}

# Execute main function
main 