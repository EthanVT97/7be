FROM php:8.1-apache

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql

# Enable Apache modules
RUN a2enmod rewrite

COPY . /var/www/html/
WORKDIR /var/www/html

EXPOSE 80
CMD ["apache2-foreground"]
