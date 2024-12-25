<?php
require_once __DIR__ . '/config.php';

class JWTAuth {
    private $secretKey;
    private $algorithm;
    private $issuer;
    
    public function __construct() {
        $this->secretKey = getenv('JWT_SECRET') ?: 'your-secret-key-change-this-in-production';
        $this->algorithm = 'HS256';
        $this->issuer = 'lottery-api';
    }
    
    public function generateToken($userId, $role = 'user') {
        $issuedAt = time();
        $expire = $issuedAt + 3600; // 1 hour
        
        $payload = [
            'iss' => $this->issuer,
            'iat' => $issuedAt,
            'exp' => $expire,
            'user_id' => $userId,
            'role' => $role
        ];
        
        return $this->encode($payload);
    }
    
    public function validateToken($token) {
        try {
            $payload = $this->decode($token);
            
            // Check expiration
            if (isset($payload['exp']) && $payload['exp'] < time()) {
                return false;
            }
            
            // Check issuer
            if ($payload['iss'] !== $this->issuer) {
                return false;
            }
            
            return $payload;
            
        } catch (Exception $e) {
            error_log("JWT Validation Error: " . $e->getMessage());
            return false;
        }
    }
    
    private function encode($payload) {
        $header = json_encode([
            'typ' => 'JWT',
            'alg' => $this->algorithm
        ]);
        
        $base64UrlHeader = $this->base64UrlEncode($header);
        $base64UrlPayload = $this->base64UrlEncode(json_encode($payload));
        
        $signature = hash_hmac('sha256', 
            $base64UrlHeader . "." . $base64UrlPayload, 
            $this->secretKey, 
            true
        );
        
        $base64UrlSignature = $this->base64UrlEncode($signature);
        
        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }
    
    private function decode($token) {
        list($base64UrlHeader, $base64UrlPayload, $base64UrlSignature) = explode('.', $token);
        
        $signature = $this->base64UrlDecode($base64UrlSignature);
        
        $expectedSignature = hash_hmac('sha256', 
            $base64UrlHeader . "." . $base64UrlPayload, 
            $this->secretKey, 
            true
        );
        
        if (!hash_equals($signature, $expectedSignature)) {
            throw new Exception('Invalid signature');
        }
        
        return json_decode($this->base64UrlDecode($base64UrlPayload), true);
    }
    
    private function base64UrlEncode($data) {
        $base64 = base64_encode($data);
        return str_replace(['+', '/', '='], ['-', '_', ''], $base64);
    }
    
    private function base64UrlDecode($data) {
        $base64 = str_replace(['-', '_'], ['+', '/'], $data);
        return base64_decode($base64);
    }
}
