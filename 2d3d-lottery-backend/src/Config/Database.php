<?php
namespace App\Config;

use PDO;
use PDOException;

class Database {
    private static $instance = null;
    private $conn;
    private $settings;
    private $maxRetries = 3;
    private $retryDelay = 1; // seconds

    private function __construct() {
        $this->initializeSettings();
    }

    // Singleton pattern implementation
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function initializeSettings() {
        $this->settings = [
            'connection' => [
                'host' => getenv('DB_HOST') ?: 'dpg-ctm70o9opnds73fdciig-a.singapore-postgres.render.com',
                'port' => getenv('DB_PORT') ?: '5432',
                'name' => getenv('DB_NAME') ?: 'db_2d3d_lottery_db',
                'user' => getenv('DB_USER') ?: 'db_2d3d_lottery_db_user',
                'pass' => getenv('DB_PASS') ?: 'ZcV5s0MAJrFxPyYfQFr7lJFADwxFAn6b',
                'charset' => 'utf8'
            ],
            'options' => [
                // Error Handling
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                
                // Connection Settings
                PDO::ATTR_PERSISTENT => true,
                
                // Timeouts
                PDO::ATTR_TIMEOUT => getenv('DB_TIMEOUT') ?: 5,
                
                // SSL Configuration
                'sslmode' => 'require',
                
                // Connection Pool
                'max_connections' => getenv('DB_MAX_CONNECTIONS') ?: 20,
                'min_connections' => getenv('DB_MIN_CONNECTIONS') ?: 1,
            ],
            'monitoring' => [
                'statement_timeout' => getenv('DB_STATEMENT_TIMEOUT') ?: '30s',
                'lock_timeout' => getenv('DB_LOCK_TIMEOUT') ?: '10s',
                'application_name' => getenv('APP_NAME') ?: '2d3d_lottery_app',
                'log_level' => getenv('DB_LOG_LEVEL') ?: 'warning'
            ]
        ];
    }

    public function getConnection() {
        if ($this->conn === null || !$this->isConnectionAlive()) {
            $this->conn = $this->connectWithRetry();
        }
        return $this->conn;
    }

    private function isConnectionAlive() {
        try {
            return $this->conn && $this->conn->query('SELECT 1')->fetch();
        } catch (PDOException $e) {
            return false;
        }
    }

    private function connectWithRetry() {
        $attempts = 0;
        $lastError = null;

        while ($attempts < $this->maxRetries) {
            try {
                $conn = $this->createConnection();
                $this->configureConnection($conn);
                return $conn;

            } catch(PDOException $e) {
                $attempts++;
                $lastError = $e;

                if ($attempts < $this->maxRetries) {
                    $this->logRetryAttempt($attempts, $e);
                    sleep($this->retryDelay);
                    continue;
                }

                $this->handleConnectionError($lastError);
            }
        }

        return null;
    }

    private function createConnection() {
        $dsn = sprintf(
            "pgsql:host=%s;port=%s;dbname=%s",
            $this->settings['connection']['host'],
            $this->settings['connection']['port'],
            $this->settings['connection']['name']
        );

        return new PDO(
            $dsn,
            $this->settings['connection']['user'],
            $this->settings['connection']['pass'],
            $this->settings['options']
        );
    }

    private function configureConnection($conn) {
        // Set application specific configurations
        $conn->exec($this->getConnectionConfigQuery());

        // Enable monitoring in production
        if ($this->isProduction()) {
            $conn->exec($this->getMonitoringConfigQuery());
        }
    }

    private function getConnectionConfigQuery() {
        return sprintf("
            SET application_name = '%s';
            SET statement_timeout = '%s';
            SET lock_timeout = '%s';
            SET timezone = 'Asia/Yangon';
            SET client_encoding = 'UTF8';
        ",
            $this->settings['monitoring']['application_name'],
            $this->settings['monitoring']['statement_timeout'],
            $this->settings['monitoring']['lock_timeout']
        );
    }

    private function getMonitoringConfigQuery() {
        return sprintf("
            SET client_min_messages = '%s';
            SET log_statement = 'all';
            SET log_duration = 'on';
            SET log_connections = 'on';
            SET log_disconnections = 'on';
        ",
            $this->settings['monitoring']['log_level']
        );
    }

    private function logRetryAttempt($attempt, $error) {
        $message = sprintf(
            "Database connection attempt %d failed: %s. Retrying in %d seconds...",
            $attempt,
            $error->getMessage(),
            $this->retryDelay
        );
        
        if ($this->isProduction()) {
            error_log($message);
        } else {
            echo $message . PHP_EOL;
        }
    }

    private function handleConnectionError($error) {
        if ($this->isProduction()) {
            error_log(sprintf(
                "Database connection failed after %d attempts: %s",
                $this->maxRetries,
                $error->getMessage()
            ));
            throw new PDOException('Database connection failed');
        }
        throw $error;
    }

    public function closeConnection() {
        if ($this->conn !== null) {
            if ($this->isProduction()) {
                $this->logConnectionStats();
            }
            $this->conn = null;
        }
    }

    private function logConnectionStats() {
        try {
            $stats = $this->conn->query("
                SELECT 
                    numbackends as active_connections,
                    xact_commit as commits,
                    xact_rollback as rollbacks,
                    blks_read,
                    blks_hit,
                    tup_returned,
                    tup_fetched
                FROM pg_stat_database 
                WHERE datname = current_database()
            ")->fetch();
            
            error_log("DB Stats before close: " . json_encode($stats));
        } catch (PDOException $e) {
            error_log("Failed to log connection stats: " . $e->getMessage());
        }
    }

    private function isProduction() {
        return getenv('APP_ENV') === 'production';
    }

    public function __destruct() {
        $this->closeConnection();
    }

    // Prevent cloning of the instance
    private function __clone() {}

    // Prevent unserializing of the instance
    private function __wakeup() {}
} 