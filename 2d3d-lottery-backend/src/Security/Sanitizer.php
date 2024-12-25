<?php
namespace App\Security;

class Sanitizer {
    public static function clean($input) {
        if (is_array($input)) {
            return array_map([self::class, 'clean'], $input);
        }
        
        return htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    }
    
    public static function validateNumber($input) {
        return filter_var($input, FILTER_VALIDATE_INT) !== false;
    }
    
    public static function validatePhone($input) {
        return preg_match('/^[0-9]{11}$/', $input);
    }
} 