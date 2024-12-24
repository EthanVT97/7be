FROM php:8.1-apache

# Install PHP extensions and dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo pdo_mysql

# PHP Configuration
RUN echo "display_errors = On" >> /usr/local/etc/php/conf.d/error-reporting.ini \
    && echo "display_startup_errors = On" >> /usr/local/etc/php/conf.d/error-reporting.ini \
    && echo "error_reporting = E_ALL" >> /usr/local/etc/php/conf.d/error-reporting.ini

# Enable Apache modules
RUN a2enmod rewrite headers

# Configure VirtualHost
RUN echo '\
<VirtualHost *:80>\n\
    ServerAdmin webmaster@localhost\n\
    DocumentRoot /var/www/html\n\
    DirectoryIndex index.php\n\
\n\
    <Directory /var/www/html>\n\
        Options Indexes FollowSymLinks\n\
        AllowOverride None\n\
        Require all granted\n\
\n\
        RewriteEngine On\n\
        RewriteCond %{REQUEST_FILENAME} !-f\n\
        RewriteCond %{REQUEST_FILENAME} !-d\n\
        RewriteRule ^(.*)$ index.php [QSA,L]\n\
    </Directory>\n\
\n\
    ErrorLog ${APACHE_LOG_DIR}/error.log\n\
    CustomLog ${APACHE_LOG_DIR}/access.log combined\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Copy application files
COPY . /var/www/html/
WORKDIR /var/www/html

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod 644 /var/www/html/*.php

EXPOSE 80
CMD ["apache2-foreground"]
