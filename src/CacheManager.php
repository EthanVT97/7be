<?php
declare(strict_types=1);

require_once __DIR__ . '/types.php';

/**
 * Cache manager class that supports both Redis and file-based caching
 */
class CacheManager {
    private ?\Redis $redis = null;
    private string $prefix;
    private int $defaultTTL;
    
    public function __construct(string $prefix = 'lottery:', int $defaultTTL = 3600) {
        $this->prefix = $prefix;
        $this->defaultTTL = $defaultTTL;
        
        if (extension_loaded('redis')) {
            try {
                $this->redis = new \Redis();
                $this->redis->connect('127.0.0.1', 6379);
            } catch (\Exception $e) {
                error_log("Redis connection failed: " . $e->getMessage());
                $this->redis = null;
            }
        } else {
            error_log("Redis extension not loaded. Using file-based caching.");
        }
    }
    
    public function get(string $key): mixed {
        $key = $this->prefix . $key;
        
        if ($this->redis instanceof \Redis) {
            return $this->getFromRedis($key);
        } else {
            return $this->getFromFile($key);
        }
    }
    
    public function set(string $key, mixed $value, ?int $ttl = null): bool {
        $key = $this->prefix . $key;
        $ttl = $ttl ?? $this->defaultTTL;
        
        if ($this->redis instanceof \Redis) {
            return $this->setInRedis($key, $value, $ttl);
        } else {
            return $this->setInFile($key, $value, $ttl);
        }
    }
    
    public function delete(string $key): bool {
        $key = $this->prefix . $key;
        
        if ($this->redis instanceof \Redis) {
            return (bool)$this->redis->del($key);
        } else {
            $file = $this->getCacheFile($key);
            if (file_exists($file)) {
                return unlink($file);
            }
            return true;
        }
    }
    
    public function flush(): bool {
        if ($this->redis instanceof \Redis) {
            return $this->redis->flushAll();
        } else {
            $files = glob($this->getCacheDir() . '/*');
            if ($files === false) {
                return false;
            }
            foreach ($files as $file) {
                unlink($file);
            }
            return true;
        }
    }
    
    private function getFromRedis(string $key): mixed {
        if (!$this->redis instanceof \Redis) {
            return null;
        }
        $value = $this->redis->get($key);
        return $value ? json_decode($value, true) : null;
    }
    
    private function setInRedis(string $key, mixed $value, int $ttl): bool {
        if (!$this->redis instanceof \Redis) {
            return false;
        }
        return $this->redis->setex($key, $ttl, json_encode($value));
    }
    
    private function getFromFile(string $key): mixed {
        $file = $this->getCacheFile($key);
        
        if (!file_exists($file)) {
            return null;
        }
        
        $data = json_decode(file_get_contents($file), true);
        
        if (!$data || $data['expires'] < time()) {
            unlink($file);
            return null;
        }
        
        return $data['value'];
    }
    
    private function setInFile(string $key, mixed $value, int $ttl): bool {
        $file = $this->getCacheFile($key);
        $data = [
            'value' => $value,
            'expires' => time() + $ttl
        ];
        
        if (!file_exists($this->getCacheDir())) {
            mkdir($this->getCacheDir(), 0777, true);
        }
        
        return file_put_contents($file, json_encode($data)) !== false;
    }
    
    private function getCacheFile(string $key): string {
        return $this->getCacheDir() . '/' . md5($key) . '.cache';
    }
    
    private function getCacheDir(): string {
        return __DIR__ . '/../cache';
    }
}
