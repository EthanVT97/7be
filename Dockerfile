FROM php:8.1-apache

# Install PHP extensions and dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# PHP Configuration
RUN echo "display_errors = On" >> /usr/local/etc/php/conf.d/error-reporting.ini \
    && echo "display_startup_errors = On" >> /usr/local/etc/php/conf.d/error-reporting.ini \
    && echo "error_reporting = E_ALL" >> /usr/local/etc/php/conf.d/error-reporting.ini \
    && echo "log_errors = On" >> /usr/local/etc/php/conf.d/error-reporting.ini \
    && echo "error_log = /dev/stderr" >> /usr/local/etc/php/conf.d/error-reporting.ini

# Enable Apache modules
RUN a2enmod rewrite headers

# Configure Apache
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
RUN echo '<Directory /var/www/html/>' >> /etc/apache2/apache2.conf
RUN echo '    Options Indexes FollowSymLinks' >> /etc/apache2/apache2.conf
RUN echo '    AllowOverride All' >> /etc/apache2/apache2.conf
RUN echo '    Require all granted' >> /etc/apache2/apache2.conf
RUN echo '    SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1' >> /etc/apache2/apache2.conf
RUN echo '</Directory>' >> /etc/apache2/apache2.conf

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy application files
COPY . /var/www/html/
WORKDIR /var/www/html

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod 644 /var/www/html/*.php

# Environment variables with defaults
ENV DB_HOST=sql12.freesqldatabase.com \
    DB_NAME=sql12753941 \
    DB_USER=sql12753941 \
    DB_PASS=xPMZuuk5AZ

EXPOSE 80
CMD ["apache2-foreground"]
