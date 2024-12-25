<?php
namespace App\Controllers;

use App\Services\AuthService;
use Exception;

class AuthController {
    private $authService;

    public function __construct() {
        $this->authService = new AuthService();
    }

    public function login() {
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['username']) || !isset($data['password'])) {
                throw new Exception('Username and password are required');
            }

            $result = $this->authService->login($data['username'], $data['password']);
            
            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'data' => $result
            ]);
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    public function register() {
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['username']) || !isset($data['password']) || !isset($data['email'])) {
                throw new Exception('Username, password and email are required');
            }

            $result = $this->authService->register($data);
            
            http_response_code(201);
            echo json_encode([
                'status' => 'success',
                'data' => $result
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }

    public function logout() {
        try {
            $this->authService->logout();
            
            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'message' => 'Logged out successfully'
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => $e->getMessage()
            ]);
        }
    }
} 