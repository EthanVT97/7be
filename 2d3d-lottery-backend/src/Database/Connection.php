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
            // Get database config
            $dbConfig = [
                'host' => $_ENV['DB_HOST'],
                'name' => $_ENV['DB_NAME'],
                'user' => $_ENV['DB_USER'],
                'pass' => $_ENV['DB_PASS']
            ];

            // Create connection
            self::$instance = new PDO(
                "mysql:host={$dbConfig['host']};dbname={$dbConfig['name']};charset=utf8mb4",
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
            error_log("Database connection attempt {$self::$attempts} failed: " . $e->getMessage());

            if (self::$attempts < self::$maxAttempts) {
                // Wait before retrying (exponential backoff)
                sleep(pow(2, self::$attempts));
                return self::connect();
            }

            throw new PDOException("Database connection failed after {$self::$maxAttempts} attempts");
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