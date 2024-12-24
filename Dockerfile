FROM php:8.1-apache

# Install PHP extensions and dependencies
RUN docker-php-ext-install pdo pdo_mysql

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Copy application files
COPY . /var/www/html/

# Set working directory
WORKDIR /var/www/html

# Apache configuration for the application
RUN echo '<Directory /var/www/html/>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' > /etc/apache2/conf-available/docker-php.conf

RUN a2enconf docker-php

# Expose port 80
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]
