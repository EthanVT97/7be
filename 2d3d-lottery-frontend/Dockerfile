# Build stage
FROM node:18.17.0-alpine as builder

# Set working directory
WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./

# Install dependencies with specific npm version and clean install
RUN npm install -g npm@10.8.2 && \
    npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM php:8.2-apache

# Install dependencies and Apache modules
RUN apt-get update && apt-get install -y \
    libssl-dev \
    ssl-cert \
    && rm -rf /var/lib/apt/lists/* \
    && a2enmod rewrite headers ssl proxy proxy_http http2

# Copy Apache configuration
COPY apache.conf /etc/apache2/sites-available/000-default.conf

# Copy built assets from builder stage
COPY --from=builder /app/public /app/public

# Set permissions
RUN chown -R www-data:www-data /app/public \
    && chmod -R 755 /app/public

# Copy health check script
COPY scripts/healthcheck.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/healthcheck.sh

# Create required directories
RUN mkdir -p /var/log/apache2 \
    && mkdir -p /var/run/apache2

# Environment variables
ENV APACHE_LOG_DIR=/var/log/apache2 \
    APACHE_RUN_DIR=/var/run/apache2 \
    APACHE_PID_FILE=/var/run/apache2/apache2.pid \
    APACHE_RUN_USER=www-data \
    APACHE_RUN_GROUP=www-data

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
    CMD /usr/local/bin/healthcheck.sh

# Start Apache
CMD ["apache2-foreground"]
