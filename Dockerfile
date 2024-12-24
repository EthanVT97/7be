# Build stage
FROM composer:2.6 as composer

WORKDIR /app
COPY composer.json ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

COPY . .
RUN composer dump-autoload --optimize

# Production stage
FROM php:8.1-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install \
    pdo \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd

# Configure Apache
RUN a2enmod rewrite headers expires
RUN sed -i 's/ServerTokens OS/ServerTokens Prod/' /etc/apache2/conf-available/security.conf
RUN sed -i 's/ServerSignature On/ServerSignature Off/' /etc/apache2/conf-available/security.conf

# Set up PHP configuration
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# Set up Apache configuration
COPY .htaccess /var/www/html/.htaccess

# Copy application files
WORKDIR /var/www/html
COPY --from=composer /app .
RUN chown -R www-data:www-data /var/www/html

# Set up environment variables
ENV APP_ENV=production \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr \
    DB_CONNECTION=mysql \
    DB_HOST=sql12.freesqldatabase.com \
    DB_NAME=sql12753941 \
    DB_USER=sql12753941 \
    DB_PASS=xPMZuuk5AZ

# Security headers
RUN echo 'Header set X-Content-Type-Options "nosniff"' >> /etc/apache2/conf-available/security.conf
RUN echo 'Header set X-Frame-Options "SAMEORIGIN"' >> /etc/apache2/conf-available/security.conf
RUN echo 'Header set X-XSS-Protection "1; mode=block"' >> /etc/apache2/conf-available/security.conf
RUN echo 'Header set Referrer-Policy "strict-origin-when-cross-origin"' >> /etc/apache2/conf-available/security.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost/api/health || exit 1

# Start Apache
CMD ["apache2-foreground"]
