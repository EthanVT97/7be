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
    libzip-dev \
    unzip \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    pdo \
    pdo_pgsql \
    gd \
    zip \
    opcache \
    && pecl install redis \
    && docker-php-ext-enable redis opcache

# Configure Apache
RUN a2enmod rewrite headers http2 ssl

# Set ServerName globally
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Switch to mpm_event for better performance
RUN a2dismod mpm_prefork \
    && a2enmod mpm_event

# Copy custom configurations
COPY docker/php/custom.ini $PHP_INI_DIR/conf.d/
COPY docker/000-default.conf /etc/apache2/sites-available/
COPY docker/start.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/start.sh

# Create necessary directories with proper permissions
RUN mkdir -p /var/www/html/storage/logs \
    && mkdir -p /var/www/html/storage/cache \
    && mkdir -p /var/www/html/storage/sessions \
    && mkdir -p /var/www/html/public

# Copy application files
WORKDIR /var/www/html
COPY --from=composer /app .

# Ensure .htaccess files are in place
COPY public/.htaccess /var/www/html/public/.htaccess
COPY .htaccess /var/www/html/.htaccess

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/public \
    && chmod 644 /var/www/html/public/.htaccess \
    && chmod 644 /var/www/html/.htaccess

# Expose port
EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Start script
CMD ["/usr/local/bin/start.sh"]
