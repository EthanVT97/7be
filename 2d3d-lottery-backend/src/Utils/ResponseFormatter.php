<?php

namespace App\Utils;

class ResponseFormatter
{
    public static function json($data, int $statusCode = 200): string
    {
        http_response_code($statusCode);
        return json_encode([
            'success' => $statusCode >= 200 && $statusCode < 300,
            'data' => $data,
            'timestamp' => date('Y-m-d H:i:s')
        ], JSON_PRETTY_PRINT);
    }

    public static function error(string $message, int $statusCode = 500): string
    {
        http_response_code($statusCode);
        return json_encode([
            'success' => false,
            'error' => [
                'code' => $statusCode,
                'message' => $message
            ],
            'timestamp' => date('Y-m-d H:i:s')
        ], JSON_PRETTY_PRINT);
    }

    public static function success($data = null, string $message = ''): string
    {
        return self::json([
            'message' => $message,
            'data' => $data
        ]);
    }

    public static function paginate(array $items, int $total, int $page, int $perPage): string
    {
        return self::json([
            'items' => $items,
            'pagination' => [
                'total' => $total,
                'per_page' => $perPage,
                'current_page' => $page,
                'total_pages' => ceil($total / $perPage)
            ]
        ]);
    }
} 