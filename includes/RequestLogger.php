<?php
class RequestLogger {
    private $logFile;
    private $conn;
    
    public function __construct($conn = null) {
        $this->logFile = __DIR__ . '/../logs/api_requests.log';
        $this->conn = $conn;
        
        // Create logs directory if it doesn't exist
        if (!file_exists(dirname($this->logFile))) {
            mkdir(dirname($this->logFile), 0777, true);
        }
    }
    
    public function log($request, $response, $duration) {
        $logEntry = [
            'timestamp' => date('Y-m-d H:i:s'),
            'ip' => $_SERVER['REMOTE_ADDR'],
            'method' => $_SERVER['REQUEST_METHOD'],
            'uri' => $_SERVER['REQUEST_URI'],
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown',
            'request_data' => $request,
            'response_code' => http_response_code(),
            'response_data' => $response,
            'duration_ms' => $duration,
            'memory_usage' => memory_get_peak_usage(true)
        ];
        
        // Log to file
        $this->logToFile($logEntry);
        
        // Log to database if available
        if ($this->conn) {
            $this->logToDatabase($logEntry);
        }
    }
    
    private function logToFile($entry) {
        $logLine = json_encode($entry) . "\n";
        file_put_contents($this->logFile, $logLine, FILE_APPEND);
    }
    
    private function logToDatabase($entry) {
        try {
            $sql = "INSERT INTO api_logs (
                timestamp, ip_address, method, uri, user_agent,
                request_data, response_code, response_data,
                duration_ms, memory_usage
            ) VALUES (
                :timestamp, :ip, :method, :uri, :user_agent,
                :request_data, :response_code, :response_data,
                :duration_ms, :memory_usage
            )";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([
                ':timestamp' => $entry['timestamp'],
                ':ip' => $entry['ip'],
                ':method' => $entry['method'],
                ':uri' => $entry['uri'],
                ':user_agent' => $entry['user_agent'],
                ':request_data' => json_encode($entry['request_data']),
                ':response_code' => $entry['response_code'],
                ':response_data' => json_encode($entry['response_data']),
                ':duration_ms' => $entry['duration_ms'],
                ':memory_usage' => $entry['memory_usage']
            ]);
        } catch (Exception $e) {
            error_log("Failed to log to database: " . $e->getMessage());
        }
    }
    
    public function getRecentLogs($limit = 100) {
        if (!$this->conn) {
            return $this->getRecentFileLog($limit);
        }
        
        try {
            $stmt = $this->conn->prepare(
                "SELECT * FROM api_logs 
                ORDER BY timestamp DESC 
                LIMIT :limit"
            );
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            error_log("Failed to get logs from database: " . $e->getMessage());
            return $this->getRecentFileLog($limit);
        }
    }
    
    private function getRecentFileLog($limit) {
        if (!file_exists($this->logFile)) {
            return [];
        }
        
        $lines = array_filter(
            array_map('trim', file($this->logFile)),
            function($line) { return !empty($line); }
        );
        
        $logs = array_map('json_decode', $lines, array_fill(0, count($lines), true));
        return array_slice(array_reverse($logs), 0, $limit);
    }
}
