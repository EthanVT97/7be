<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JWTHelper {
    private static function getKey() {
        return $_ENV['JWT_SECRET'] ?? 'your_secure_random_key_here';
    }
    
    public static function generateToken($user) {
        $payload = [
            'iss' => 'https://twod3d-lottery-api.onrender.com',
            'aud' => 'https://twod3d-lottery.onrender.com',
            'iat' => time(),
            'exp' => time() + (60 * 60 * 24), // 24 hours
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'role' => $user['role']
            ]
        ];
        
        return JWT::encode($payload, self::getKey(), 'HS256');
    }
    
    public static function validateToken($token) {
        try {
            return JWT::decode($token, new Key(self::getKey(), 'HS256'));
        } catch (Exception $e) {
            return false;
        }
    }
} 