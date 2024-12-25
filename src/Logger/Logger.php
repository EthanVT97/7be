<?php
namespace App\Logger;

class Logger {
    private static function log($level, $message, $context = []) {
        $date = date('Y-m-d H:i:s');
        $logMessage = "[{$date}] {$level}: {$message}";
        
        if (!empty($context)) {
            $logMessage .= " " . json_encode($context);
        }
        
        error_log($logMessage);
        
        // Also log to file
        $logFile = __DIR__ . "/../../logs/{$level}.log";
        file_put_contents($logFile, $logMessage . PHP_EOL, FILE_APPEND);
    }
    
    public static function error($message, $context = []) {
        self::log('ERROR', $message, $context);
    }
    
    public static function info($message, $context = []) {
        self::log('INFO', $message, $context);
    }
} 