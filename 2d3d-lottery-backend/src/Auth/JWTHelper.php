<?php
namespace App\Auth;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class JWTHelper {
    private static $key;
    private static $algorithm = 'HS256';
    private static $expiry = 3600; // 1 hour

    public static function init() {
        self::$key = getenv('JWT_SECRET');
        if (!self::$key) {
            throw new Exception('JWT_SECRET environment variable is not set');
        }
    }

    public static function generateToken($payload) {
        self::init();

        $issuedAt = time();
        $expire = $issuedAt + self::$expiry;

        $token = [
            'iat' => $issuedAt,
            'exp' => $expire,
            'data' => $payload
        ];

        return JWT::encode($token, self::$key, self::$algorithm);
    }

    public static function verifyToken($token) {
        self::init();

        try {
            $decoded = JWT::decode($token, new Key(self::$key, self::$algorithm));
            return $decoded->data;
        } catch (Exception $e) {
            error_log("JWT verification error: " . $e->getMessage());
            return false;
        }
    }
} 