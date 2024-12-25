<?php
namespace App\Config;

class Logger {
    private static $logFile;
    private static $logLevel;

    public static function initialize() {
        self::$logFile = __DIR__ . '/../../storage/logs/app.log';
        self::$logLevel = $_ENV['LOG_LEVEL'] ?? 'error';

        // Ensure log directory exists
        $logDir = dirname(self::$logFile);
        if (!is_dir($logDir)) {
            mkdir($logDir, 0777, true);
        }

        // Set error handling
        set_error_handler([self::class, 'handleError']);
        set_exception_handler([self::class, 'handleException']);
        register_shutdown_function([self::class, 'handleShutdown']);
    }

    public static function handleError($errno, $errstr, $errfile, $errline) {
        if (!(error_reporting() & $errno)) {
            return false;
        }

        $message = sprintf(
            "[%s] Error: %s in %s on line %d",
            date('Y-m-d H:i:s'),
            $errstr,
            $errfile,
            $errline
        );

        self::log($message);
        return true;
    }

    public static function handleException($exception) {
        $message = sprintf(
            "[%s] Exception: %s in %s on line %d\nStack trace:\n%s",
            date('Y-m-d H:i:s'),
            $exception->getMessage(),
            $exception->getFile(),
            $exception->getLine(),
            $exception->getTraceAsString()
        );

        self::log($message);

        if ($_ENV['APP_ENV'] === 'production') {
            http_response_code(500);
            echo json_encode([
                'error' => 'Internal Server Error',
                'message' => 'An unexpected error occurred'
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'error' => get_class($exception),
                'message' => $exception->getMessage(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine()
            ]);
        }
    }

    public static function handleShutdown() {
        $error = error_get_last();
        if ($error !== null && in_array($error['type'], [E_ERROR, E_CORE_ERROR, E_COMPILE_ERROR, E_PARSE])) {
            self::handleError($error['type'], $error['message'], $error['file'], $error['line']);
        }
    }

    private static function log($message) {
        $message .= "\n";
        file_put_contents(self::$logFile, $message, FILE_APPEND);

        if ($_ENV['APP_ENV'] !== 'production') {
            error_log($message);
        }
    }
} 