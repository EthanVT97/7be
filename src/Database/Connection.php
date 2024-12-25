<?php
namespace App\Database;

use PDO;
use PDOException;

class Connection {
    private static $instance = null;
    
    public static function getInstance() {
        if (self::$instance === null) {
            $dbConfig = [
                'host' => $_ENV['DB_HOST'] ?? 'sql12.freesqldatabase.com',
                'name' => $_ENV['DB_NAME'] ?? 'sql12753941',
                'user' => $_ENV['DB_USER'] ?? 'sql12753941',
                'pass' => $_ENV['DB_PASS'] ?? 'xPMZuuk5AZ'
            ];

            try {
                self::$instance = new PDO(
                    "mysql:host={$dbConfig['host']};dbname={$dbConfig['name']};charset=utf8mb4",
                    $dbConfig['user'],
                    $dbConfig['pass'],
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_EMULATE_PREPARES => false
                    ]
                );
            } catch (PDOException $e) {
                error_log("Connection failed: " . $e->getMessage());
                throw new PDOException("Database connection failed");
            }
        }
        
        return self::$instance;
    }

    public static function test() {
        try {
            $connection = self::getInstance();
            $connection->query('SELECT 1');
            return true;
        } catch (PDOException $e) {
            error_log("Health check failed: " . $e->getMessage());
            return false;
        }
    }
}
