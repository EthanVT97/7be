<?php

namespace App\Services;

use App\Database\Connection;
use Firebase\JWT\JWT;
use Exception;
use PDO;

class AuthService {
    private $conn;
    private $key;

    public function __construct() {
        $this->conn = Connection::getInstance();
        $this->key = $_ENV['JWT_SECRET'];
    }

    public function login($username, $password) {
        $stmt = $this->conn->prepare("
            SELECT id, username, email, password_hash, role 
            FROM users 
            WHERE username = :username
        ");
        
        $stmt->execute(['username' => $username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || !password_verify($password, $user['password_hash'])) {
            throw new Exception('Invalid credentials');
        }

        $token = JWT::encode([
            'sub' => $user['id'],
            'username' => $user['username'],
            'role' => $user['role'],
            'exp' => time() + (60 * 60) // 1 hour
        ], $this->key, 'HS256');

        return [
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'role' => $user['role']
            ]
        ];
    }

    public function register($data) {
        // Check if username exists
        $stmt = $this->conn->prepare("SELECT id FROM users WHERE username = :username");
        $stmt->execute(['username' => $data['username']]);
        if ($stmt->fetch()) {
            throw new Exception('Username already exists');
        }

        // Check if email exists
        $stmt = $this->conn->prepare("SELECT id FROM users WHERE email = :email");
        $stmt->execute(['email' => $data['email']]);
        if ($stmt->fetch()) {
            throw new Exception('Email already exists');
        }

        // Insert new user
        $stmt = $this->conn->prepare("
            INSERT INTO users (username, email, password_hash, role)
            VALUES (:username, :email, :password_hash, :role)
        ");

        $stmt->execute([
            'username' => $data['username'],
            'email' => $data['email'],
            'password_hash' => password_hash($data['password'], PASSWORD_DEFAULT),
            'role' => 'user'
        ]);

        $userId = $this->conn->lastInsertId();

        return [
            'id' => $userId,
            'username' => $data['username'],
            'email' => $data['email'],
            'role' => 'user'
        ];
    }

    public function logout() {
        // Since we're using JWT, we don't need to do anything server-side
        // The client will remove the token
        return true;
    }
} 