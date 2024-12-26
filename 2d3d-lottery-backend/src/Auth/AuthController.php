<?php
namespace App\Auth;

use PDO;
use Exception;
use App\Auth\JWTHelper;

class AuthController {
    private $conn;

    public function __construct(PDO $conn) {
        $this->conn = $conn;
    }

    public function register($username, $email, $phone, $password) {
        try {
            // Check if user exists
            $stmt = $this->conn->prepare("SELECT id FROM users WHERE username = ? OR email = ? OR phone = ?");
            $stmt->execute([$username, $email, $phone]);

            if ($stmt->rowCount() > 0) {
                return [
                    'success' => false,
                    'message' => 'အသုံးပြုသူအမည်၊ အီးမေးလ် သို့မဟုတ် ဖုန်းနံပါတ် ရှိပြီးသားဖြစ်ပါသည်။'
                ];
            }

            // Hash password
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            // Insert user
            $stmt = $this->conn->prepare(
                "INSERT INTO users (username, email, phone, password, role, status, balance, created_at, updated_at) 
                VALUES (?, ?, ?, ?, 'user', 'active', 0.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
            );
            $stmt->execute([$username, $email, $phone, $hashedPassword]);

            return [
                'success' => true,
                'message' => 'အကောင့်ဖွင့်ခြင်း အောင်မြင်ပါသည်။'
            ];
        } catch (Exception $e) {
            error_log("Registration error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'စနစ်တွင် အမှားတစ်ခု ဖြစ်ပေါ်နေပါသည်။'
            ];
        }
    }

    public function login($username, $password) {
        try {
            $stmt = $this->conn->prepare(
                "SELECT id, username, password, role, status FROM users WHERE username = ?"
            );
            $stmt->execute([$username]);
            $user = $stmt->fetch();

            if (!$user || !password_verify($password, $user['password'])) {
                return [
                    'success' => false,
                    'message' => 'အသုံးပြုသူအမည် သို့မဟုတ် စကားဝှက် မှားယွင်းနေပါသည်။'
                ];
            }

            if ($user['status'] !== 'active') {
                return [
                    'success' => false,
                    'message' => 'သင့်အကောင့် ပိတ်ထားပါသည်။'
                ];
            }

            // Update last login
            $stmt = $this->conn->prepare("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?");
            $stmt->execute([$user['id']]);

            // Generate JWT token
            $token = JWTHelper::generateToken([
                'user_id' => $user['id'],
                'username' => $user['username'],
                'role' => $user['role']
            ]);

            return [
                'success' => true,
                'message' => 'အကောင့်ဝင်ရောက်ခြင်း အောင်မြင်ပါသည်။',
                'token' => $token,
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'role' => $user['role']
                ]
            ];
        } catch (Exception $e) {
            error_log("Login error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'စနစ်တွင် အမှားတစ်ခု ဖြစ်ပေါ်နေပါသည်။'
            ];
        }
    }
}
