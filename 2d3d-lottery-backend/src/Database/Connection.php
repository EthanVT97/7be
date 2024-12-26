<?php
namespace App\Database;

use PDO;
use PDOException;

class Connection {
    private static $instance = null;
    private static $attempts = 0;
    private static $maxAttempts = 3;
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::connect();
        }
        return self::$instance;
    }

    private static function connect() {
        try {
            // Check if environment variables are loaded
            if (!function_exists('getenv')) {
                throw new PDOException('Environment functions not available');
            }

            // Get database config
            $dbConfig = [
                'host' => getenv('DB_HOST'),
                'port' => getenv('DB_PORT') ?: '5432',
                'name' => getenv('DB_NAME'),
                'user' => getenv('DB_USER'),
                'pass' => getenv('DB_PASS')
            ];

            // Validate config
            foreach ($dbConfig as $key => $value) {
                if (empty($value)) {
                    throw new PDOException("Database configuration missing: {$key}");
                }
            }

            // Create connection
            $dsn = "pgsql:host={$dbConfig['host']};port={$dbConfig['port']};dbname={$dbConfig['name']};sslmode=require";
            self::$instance = new PDO(
                $dsn,
                $dbConfig['user'],
                $dbConfig['pass'],
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::ATTR_PERSISTENT => true
                ]
            );

            // Reset attempts on successful connection
            self::$attempts = 0;

        } catch (PDOException $e) {
            self::$attempts++;
            error_log("Database connection attempt " . self::$attempts . " failed: " . $e->getMessage());

            if (self::$attempts < self::$maxAttempts) {
                // Wait before retrying (exponential backoff)
                sleep(pow(2, self::$attempts));
                return self::connect();
            }

            throw new PDOException(
                "Database connection failed after " . self::$maxAttempts . " attempts. " .
                "Last error: " . $e->getMessage()
            );
        }
    }

    public static function test() {
        try {
            $conn = self::getInstance();
            $stmt = $conn->query('SELECT 1');
            return $stmt->fetch() ? true : false;
        } catch (PDOException $e) {
            error_log("Database test failed: " . $e->getMessage());
            return false;
        }
    }
} 