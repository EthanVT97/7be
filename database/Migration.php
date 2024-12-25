<?php
namespace App\Database;

use PDO;
use PDOException;

class Migration {
    private $conn;

    public function __construct(PDO $conn) {
        $this->conn = $conn;
    }

    public function migrate() {
        try {
            // Read schema file
            $schema = file_get_contents(__DIR__ . '/schema.sql');
            
            // Execute schema
            $this->conn->exec($schema);
            
            // Create admin user
            $this->createAdminUser();
            
            return true;
        } catch (PDOException $e) {
            error_log("Migration failed: " . $e->getMessage());
            return false;
        }
    }

    private function createAdminUser() {
        $stmt = $this->conn->prepare("
            INSERT INTO users (name, phone, password, role)
            VALUES (:name, :phone, :password, 'admin')
            ON CONFLICT (phone) DO NOTHING
        ");

        $password = password_hash('admin123', PASSWORD_DEFAULT);
        
        $stmt->execute([
            'name' => 'Admin',
            'phone' => '09123456789',
            'password' => $password
        ]);
    }
} 