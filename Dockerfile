FROM php:8.1-apache

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql

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
        # URL Rewriting\n\
        RewriteEngine On\n\
        RewriteCond %{REQUEST_FILENAME} !-f\n\
        RewriteCond %{REQUEST_FILENAME} !-d\n\
        RewriteRule ^api/(.*)$ /api/index.php [QSA,L]\n\
        RewriteRule ^(.*)$ /index.php [QSA,L]\n\
\n\
        # CORS Headers\n\
        SetEnvIf Origin "^(.*)$" ORIGIN=$1\n\
        Header set Access-Control-Allow-Origin "%{ORIGIN}e" env=ORIGIN\n\
        Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"\n\
        Header set Access-Control-Allow-Headers "Content-Type, Authorization"\n\
        Header set Access-Control-Allow-Credentials "true"\n\
\n\
        # Security Headers\n\
        Header set X-Frame-Options "DENY"\n\
        Header set X-Content-Type-Options "nosniff"\n\
        Header set X-XSS-Protection "1; mode=block"\n\
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
    && chmod -R 755 /var/www/html

# Restart Apache to apply changes
RUN service apache2 restart

EXPOSE 80
CMD ["apache2-foreground"]
