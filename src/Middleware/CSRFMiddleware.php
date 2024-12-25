<?php
namespace App\Middleware;

class CSRFMiddleware {
    public function handle($request, $next) {
        $headers = getallheaders();
        $token = $_SESSION['csrf_token'] ?? null;
        
        if ($request->isMethod('POST')) {
            if (!isset($headers['X-CSRF-TOKEN']) || $headers['X-CSRF-TOKEN'] !== $token) {
                http_response_code(403);
                echo json_encode(['success' => false, 'message' => 'CSRF token mismatch']);
                exit;
            }
        }
        
        return $next($request);
    }
} 