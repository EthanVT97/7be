CREATE TABLE IF NOT EXISTS api_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    method VARCHAR(10) NOT NULL,
    uri VARCHAR(255) NOT NULL,
    user_agent VARCHAR(255),
    request_data TEXT,
    response_code INT NOT NULL,
    response_data TEXT,
    duration_ms FLOAT NOT NULL,
    memory_usage BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_timestamp (timestamp),
    INDEX idx_ip_address (ip_address),
    INDEX idx_uri (uri(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
