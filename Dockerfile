FROM php:8.1-apache

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql

# Enable Apache modules and configure
RUN a2enmod rewrite headers
RUN echo '\n\
<VirtualHost *:80>\n\
    DocumentRoot /var/www/html\n\
    DirectoryIndex index.php\n\
\n\
    <Directory /var/www/html>\n\
        Options Indexes FollowSymLinks\n\
        AllowOverride None\n\
        Require all granted\n\
\n\
        # Handle CORS\n\
        Header set Access-Control-Allow-Origin "*"\n\
        Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"\n\
        Header set Access-Control-Allow-Headers "Content-Type, Authorization"\n\
\n\
        # URL Rewriting\n\
        RewriteEngine On\n\
        RewriteCond %{REQUEST_FILENAME} !-f\n\
        RewriteCond %{REQUEST_FILENAME} !-d\n\
        RewriteRule ^api/(.*)$ api/index.php [QSA,L]\n\
        RewriteRule ^(.*)$ index.php [QSA,L]\n\
    </Directory>\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Copy application files
COPY . /var/www/html/
WORKDIR /var/www/html

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

EXPOSE 80
CMD ["apache2-foreground"]
