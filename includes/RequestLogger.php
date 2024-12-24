<?php
class RequestLogger {
    private $conn;

    public function __construct($conn = null) {
        $this->conn = $conn;
    }

    public function log($request, $response, $duration = 0) {
        if (!$this->conn) {
            return;
        }

        try {
            // Create table if it doesn't exist
            $this->conn->exec("CREATE TABLE IF NOT EXISTS api_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                request_method VARCHAR(10) NOT NULL,
                request_path VARCHAR(255) NOT NULL,
                request_body TEXT,
                response_code INT,
                response_body TEXT,
                ip_address VARCHAR(45),
                user_agent VARCHAR(255),
                duration FLOAT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

            $stmt = $this->conn->prepare("
                INSERT INTO api_logs 
                (request_method, request_path, request_body, response_code, response_body, ip_address, user_agent, duration)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");

            $stmt->execute([
                $_SERVER['REQUEST_METHOD'],
                $_SERVER['REQUEST_URI'],
                json_encode($request),
                http_response_code(),
                json_encode($response),
                $_SERVER['REMOTE_ADDR'],
                $_SERVER['HTTP_USER_AGENT'] ?? '',
                $duration
            ]);
        } catch (PDOException $e) {
            error_log("Failed to log to database: " . $e->getMessage());
        }
    }
}
