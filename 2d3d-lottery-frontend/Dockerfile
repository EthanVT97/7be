FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    libssl-dev \
    ssl-cert \
    zip \
    unzip \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    pgsql \
    zip \
    opcache

# Enable Apache modules
RUN a2enmod \
    rewrite \
    headers \
    ssl \
    proxy \
    proxy_http \
    http2

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy Apache configuration
COPY docker/000-default.conf /etc/apache2/sites-available/000-default.conf

# Set working directory
WORKDIR /var/www/html

# Create required directories first
RUN mkdir -p /var/log/apache2 \
    && mkdir -p /var/run/apache2 \
    && mkdir -p storage/logs \
    && mkdir -p storage/framework/cache \
    && mkdir -p storage/framework/sessions \
    && mkdir -p storage/framework/views

# Copy composer files
COPY composer.json composer.lock ./

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy application files
COPY . .

# Copy PHP configuration
COPY docker/php/custom.ini /usr/local/etc/php/conf.d/custom.ini

# Copy health check script
COPY scripts/healthcheck.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/healthcheck.sh

# Set permissions (after all files are copied and directories are created)
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 777 storage

# Environment variables
ENV APACHE_LOG_DIR=/var/log/apache2 \
    APACHE_RUN_DIR=/var/run/apache2 \
    APACHE_PID_FILE=/var/run/apache2/apache2.pid \
    APACHE_RUN_USER=www-data \
    APACHE_RUN_GROUP=www-data

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
    CMD /usr/local/bin/healthcheck.sh

# Start Apache
CMD ["apache2-foreground"]
