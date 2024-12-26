<?php
namespace App\Security;

class KeyGenerator {
    public static function generateSecureKey(int $length = 32): string {
        return bin2hex(random_bytes($length));
    }

    public static function generateJwtSecret(int $length = 64): string {
        return base64_encode(random_bytes($length));
    }
} 