<?php
namespace App\Exceptions;

class Handler {
    public static function handle(\Throwable $e) {
        error_log($e->getMessage());
        
        $code = $e->getCode() ?: 500;
        if (!is_int($code) || $code < 100 || $code > 599) {
            $code = 500;
        }

        http_response_code($code);
        echo json_encode([
            'success' => false,
            'message' => $_ENV['APP_DEBUG'] ? $e->getMessage() : 'Internal Server Error',
            'trace' => $_ENV['APP_DEBUG'] ? $e->getTraceAsString() : null
        ]);
    }
} 