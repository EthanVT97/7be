<?php
namespace App\Helpers;

class JWT {
    private static $secret = "your_secret_key";
    private static $algorithm = "HS256";

    public static function generate($payload) {
        $header = json_encode([
            "typ" => "JWT",
            "alg" => self::$algorithm
        ]);

        $payload = json_encode($payload);

        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));

        $signature = hash_hmac('sha256', 
            $base64UrlHeader . "." . $base64UrlPayload, 
            self::$secret, 
            true
        );
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    public static function verify($token) {
        // Implement token verification
    }
} 