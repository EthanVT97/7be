FROM php:8.2-apache

# Install dependencies
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    && docker-php-ext-install zip

# Enable Apache modules
RUN a2enmod rewrite headers ssl

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY public/ /var/www/html/
COPY .htaccess /var/www/html/.htaccess
COPY apache.conf /etc/apache2/sites-available/000-default.conf

# Remove any static HTML files except index.html
RUN find /var/www/html -type f -name "*.html" ! -name "index.html" -delete

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Configure Apache
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf \
    && echo "DirectoryIndex index.html" >> /etc/apache2/apache2.conf

# Enable the site
RUN a2ensite 000-default

# Expose ports
EXPOSE 80
EXPOSE 443

# Start Apache
CMD ["apache2-foreground"] 