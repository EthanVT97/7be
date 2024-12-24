FROM php:8.1-apache

# Install PHP extensions and enable Apache modules
RUN docker-php-ext-install pdo pdo_mysql
RUN a2enmod rewrite headers

# Set Apache configuration for CORS
RUN echo '\
<IfModule mod_headers.c>\n\
    Header set Access-Control-Allow-Origin "*"\n\
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"\n\
    Header set Access-Control-Allow-Headers "Content-Type, Authorization"\n\
</IfModule>' > /etc/apache2/conf-available/cors.conf

RUN a2enconf cors

COPY . /var/www/html/
WORKDIR /var/www/html

EXPOSE 80
CMD ["apache2-foreground"]
