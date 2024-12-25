<?php
namespace App\Middleware;

use PDO;
use Exception;

class RateLimitMiddleware {
    private $conn;
    private $maxRequests;
    private $timeWindow;

    public function __construct(PDO $conn) {
        $this->conn = $conn;
        $this->maxRequests = getenv('RATE_LIMIT') ?: 60;
        $this->timeWindow = getenv('RATE_WINDOW') ?: 60;
    }

    public function checkRateLimit($ipAddress) {
        try {
            // Clean up old records
            $this->cleanup();

            // Get current request count
            $count = $this->getRequestCount($ipAddress);

            if ($count >= $this->maxRequests) {
                return false;
            }

            // Update request count
            $this->updateRequestCount($ipAddress);

            return true;

        } catch (Exception $e) {
            error_log("Rate limit error: " . $e->getMessage());
            return true; // Allow request on error
        }
    }

    private function cleanup() {
        $stmt = $this->conn->prepare("
            DELETE FROM rate_limits 
            WHERE last_request < NOW() - INTERVAL '{$this->timeWindow} seconds'
        ");
        $stmt->execute();
    }

    private function getRequestCount($ipAddress) {
        $stmt = $this->conn->prepare("
            SELECT request_count 
            FROM rate_limits 
            WHERE ip_address = :ip 
            AND last_request >= NOW() - INTERVAL '{$this->timeWindow} seconds'
        ");
        
        $stmt->execute(['ip' => $ipAddress]);
        $result = $stmt->fetch();

        return $result ? $result['request_count'] : 0;
    }

    private function updateRequestCount($ipAddress) {
        $stmt = $this->conn->prepare("
            INSERT INTO rate_limits (ip_address, request_count, last_request)
            VALUES (:ip, 1, NOW())
            ON CONFLICT (ip_address) DO UPDATE
            SET request_count = rate_limits.request_count + 1,
                last_request = NOW()
        ");

        $stmt->execute(['ip' => $ipAddress]);
    }
} 