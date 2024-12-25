<?php
namespace App\Config;

class Cache {
    private static $cacheDir;
    private static $enabled;

    public static function initialize() {
        self::$cacheDir = __DIR__ . '/../../storage/cache';
        self::$enabled = $_ENV['ENABLE_CACHE'] ?? false;

        if (self::$enabled) {
            self::setupCacheDirectory();
        }
    }

    private static function setupCacheDirectory() {
        if (!is_dir(self::$cacheDir)) {
            mkdir(self::$cacheDir, 0777, true);
        }

        // Create .htaccess to prevent direct access
        $htaccess = self::$cacheDir . '/.htaccess';
        if (!file_exists($htaccess)) {
            file_put_contents($htaccess, "Deny from all");
        }

        // Create empty index.html
        $index = self::$cacheDir . '/index.html';
        if (!file_exists($index)) {
            file_put_contents($index, "");
        }
    }

    public static function set($key, $value, $ttl = 3600) {
        if (!self::$enabled) return false;

        $file = self::$cacheDir . '/' . md5($key) . '.cache';
        $data = [
            'expires' => time() + $ttl,
            'value' => $value
        ];

        return file_put_contents($file, serialize($data)) !== false;
    }

    public static function get($key) {
        if (!self::$enabled) return null;

        $file = self::$cacheDir . '/' . md5($key) . '.cache';
        
        if (!file_exists($file)) {
            return null;
        }

        $data = unserialize(file_get_contents($file));
        
        if ($data['expires'] < time()) {
            unlink($file);
            return null;
        }

        return $data['value'];
    }

    public static function clear() {
        if (!self::$enabled) return;

        $files = glob(self::$cacheDir . '/*.cache');
        foreach ($files as $file) {
            unlink($file);
        }
    }

    public static function isEnabled() {
        return self::$enabled;
    }
} 