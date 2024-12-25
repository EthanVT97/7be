# 2D3D Lottery System

A modern lottery management system built with PHP.

## Deployment on Render

1. Fork this repository
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Use the following settings:
   - Environment: PHP
   - Build Command: `composer install --no-dev --optimize-autoloader`
   - Start Command: `vendor/bin/heroku-php-apache2 public/`

## Environment Variables

Set these in your Render dashboard:
- `DB_HOST`
- `DB_NAME`
- `DB_USER`
- `DB_PASS`
- `JWT_SECRET`

## Local Development

1. Clone the repository
2. Run `composer install`
3. Copy `.env.example` to `.env` and configure
4. Start PHP server: `php -S localhost:8000 -t public`

## Features

- Real-time lottery results
- User authentication and profile management
- Secure payment processing
- Historical data tracking
- Responsive design
