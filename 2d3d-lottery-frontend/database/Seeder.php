<?php
namespace App\Database;

use PDO;
use PDOException;

class Seeder {
    private $conn;

    public function __construct(PDO $conn) {
        $this->conn = $conn;
    }

    public function seed() {
        try {
            // Seed test users
            $this->seedUsers();
            
            // Seed test sales
            $this->seedSales();
            
            // Seed test results
            $this->seedResults();
            
            return true;
        } catch (PDOException $e) {
            error_log("Seeding failed: " . $e->getMessage());
            return false;
        }
    }

    private function seedUsers() {
        $users = [
            ['Agent 1', '09111111111', 'agent'],
            ['Agent 2', '09222222222', 'agent'],
            ['Seller 1', '09333333333', 'seller'],
            ['Seller 2', '09444444444', 'seller']
        ];

        $stmt = $this->conn->prepare("
            INSERT INTO users (name, phone, password, role)
            VALUES (:name, :phone, :password, :role)
            ON CONFLICT (phone) DO NOTHING
        ");

        foreach ($users as $user) {
            $stmt->execute([
                'name' => $user[0],
                'phone' => $user[1],
                'password' => password_hash('password123', PASSWORD_DEFAULT),
                'role' => $user[2]
            ]);
        }
    }

    private function seedSales() {
        // Add sample sales data
    }

    private function seedResults() {
        // Add sample results data
    }
} 