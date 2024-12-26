<?php
require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Print all environment variables
echo "Environment Variables:\n";
echo "DB_HOST: " . $_ENV['DB_HOST'] . "\n";
echo "DB_PORT: " . $_ENV['DB_PORT'] . "\n";
echo "DB_NAME: " . $_ENV['DB_NAME'] . "\n";
echo "DB_USER: " . $_ENV['DB_USER'] . "\n";
echo "DB_PASS: " . $_ENV['DB_PASS'] . "\n";
echo "APP_ENV: " . $_ENV['APP_ENV'] . "\n"; 