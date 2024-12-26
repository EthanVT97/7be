<?php
namespace App\Config;

class ErrorHandler {
    public static function register() {
        error_reporting(E_ALL);
        
        if (getenv('APP_ENV') === 'production') {
            ini_set('display_errors', 0);
            ini_set('log_errors', 1);
            ini_set('error_log', __DIR__ . '/../../logs/error.log');
        } else {
            ini_set('display_errors', 1);
        }

        set_error_handler([self::class, 'handleError']);
        set_exception_handler([self::class, 'handleException']);
    }

    public static function handleError($errno, $errstr, $errfile, $errline) {
        if (!(error_reporting() & $errno)) {
            return false;
        }

        $message = sprintf(
            "Error: %s\nFile: %s\nLine: %d\n",
            $errstr,
            $errfile,
            $errline
        );

        if (getenv('APP_ENV') === 'production') {
            error_log($message);
        } else {
            echo $message;
        }

        return true;
    }

    public static function handleException($exception) {
        $message = sprintf(
            "Exception: %s\nFile: %s\nLine: %d\nTrace:\n%s\n",
            $exception->getMessage(),
            $exception->getFile(),
            $exception->getLine(),
            $exception->getTraceAsString()
        );

        if (getenv('APP_ENV') === 'production') {
            error_log($message);
            http_response_code(500);
            echo json_encode(['error' => 'Internal Server Error']);
        } else {
            echo $message;
        }
    }
} 