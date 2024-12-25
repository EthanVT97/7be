<?php
class JWT
{
    private static function base64UrlEncode($data)
    {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
    }

    private static function base64UrlDecode($data)
    {
        return base64_decode(str_replace(['-', '_'], ['+', '/'], $data));
    }

    public static function generate($payload)
    {
        $header = json_encode(['typ' => 'JWT', 'alg' => JWT_ALGORITHM]);
        $payload['iat'] = time();
        $payload['exp'] = time() + JWT_EXPIRY;

        $base64UrlHeader = self::base64UrlEncode($header);
        $base64UrlPayload = self::base64UrlEncode(json_encode($payload));

        $signature = hash_hmac(
            'sha256',
            $base64UrlHeader . "." . $base64UrlPayload,
            JWT_SECRET,
            true
        );

        $base64UrlSignature = self::base64UrlEncode($signature);

        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    public static function verify($token)
    {
        try {
            $tokenParts = explode('.', $token);
            if (count($tokenParts) !== 3) {
                return false;
            }

            $header = json_decode(self::base64UrlDecode($tokenParts[0]), true);
            $payload = json_decode(self::base64UrlDecode($tokenParts[1]), true);

            // Verify expiration
            if (isset($payload['exp']) && $payload['exp'] < time()) {
                return false;
            }

            // Verify signature
            $signature = self::base64UrlDecode($tokenParts[2]);
            $expectedSignature = hash_hmac(
                'sha256',
                $tokenParts[0] . "." . $tokenParts[1],
                JWT_SECRET,
                true
            );

            return hash_equals($signature, $expectedSignature) ? $payload : false;
        } catch (Exception $e) {
            error_log('JWT Verification failed: ' . $e->getMessage());
            return false;
        }
    }
}
