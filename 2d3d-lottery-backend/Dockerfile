# Build stage
FROM composer:2.6 as composer

WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --ignore-platform-reqs

COPY . .
RUN composer dump-autoload --optimize

# Production stage
FROM php:8.1-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    redis \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    && pecl install redis \
    && docker-php-ext-enable redis

# Configure Apache
RUN a2enmod rewrite headers

# Copy custom configurations
COPY docker/php/custom.ini $PHP_INI_DIR/conf.d/
COPY docker/000-default.conf /etc/apache2/sites-available/
COPY docker/start.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/start.sh

# Copy application files
WORKDIR /var/www/html
COPY --from=composer /app .
RUN chown -R www-data:www-data /var/www/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost/health.php || exit 1

# Start script
CMD ["/usr/local/bin/start.sh"]
