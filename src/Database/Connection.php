<?php
namespace App\Database;

use PDO;
use PDOException;

class Connection {
    private static $instance = null;
    
    public static function getInstance() {
        if (self::$instance === null) {
            $dbConfig = [
                'host' => $_ENV['DB_HOST'] ?? 'dpg-ctm70o9opnds73fdciig-a.singapore-postgres.render.com',
                'port' => $_ENV['DB_PORT'] ?? '5432',
                'name' => $_ENV['DB_NAME'] ?? 'db_2d3d_lottery_db',
                'user' => $_ENV['DB_USER'] ?? 'db_2d3d_lottery_db_user',
                'pass' => $_ENV['DB_PASS'] ?? 'ZcV5s0MAJrFxPyYfQFr7lJFADwxFAn6b'
            ];

            try {
                self::$instance = new PDO(
                    "pgsql:host={$dbConfig['host']};port={$dbConfig['port']};dbname={$dbConfig['name']};",
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
