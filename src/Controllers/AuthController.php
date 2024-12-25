<?php
namespace App\Controllers;

use App\Database\Connection;
use Firebase\JWT\JWT;

class AuthController {
    private $conn;
    private $key;

    public function __construct() {
        $db = Connection::getInstance();
        $this->conn = $db->getConnection();
        $this->key = getenv('JWT_SECRET');
    }

    public function login() {
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['phone']) || !isset($data['password'])) {
                throw new \Exception('Phone and password are required');
            }

            $stmt = $this->conn->prepare("
                SELECT id, name, phone, password, role 
                FROM users 
                WHERE phone = :phone
            ");
            
            $stmt->execute(['phone' => $data['phone']]);
            $user = $stmt->fetch();

            if (!$user || !password_verify($data['password'], $user['password'])) {
                throw new \Exception('Invalid credentials');
            }

            $token = JWT::encode([
                'sub' => $user['id'],
                'name' => $user['name'],
                'role' => $user['role'],
                'exp' => time() + (60 * 60) // 1 hour
            ], $this->key, 'HS256');

            return [
                'status' => 'success',
                'token' => $token,
                'user' => [
                    'id' => $user['id'],
                    'name' => $user['name'],
                    'role' => $user['role']
                ]
            ];

        } catch (\Exception $e) {
            http_response_code(401);
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }
} 