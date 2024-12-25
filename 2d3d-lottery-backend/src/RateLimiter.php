<?php
declare(strict_types=1);

require_once __DIR__ . '/types.php';

/**
 * Rate limiter class that supports both Redis and file-based storage
 */
class RateLimiter {
    private ?\Redis $redis = null;
    private int $maxRequests;
    private int $timeWindow;
    
    public function __construct(int $maxRequests = 60, int $timeWindow = 60) {
        $this->maxRequests = $maxRequests;
        $this->timeWindow = $timeWindow;
        
        if (extension_loaded('redis')) {
            try {
                $this->redis = new \Redis();
                $this->redis->connect('127.0.0.1', 6379);
            } catch (\Exception $e) {
                error_log("Redis connection failed: " . $e->getMessage());
                $this->redis = null;
            }
        } else {
            error_log("Redis extension not loaded. Using file-based rate limiting.");
        }
    }
    
    public function checkLimit(string $identifier): bool {
        $key = "rate_limit:" . $identifier;
        
        if ($this->redis instanceof \Redis) {
            return $this->checkRedisLimit($key);
        } else {
            return $this->checkFileLimit($key);
        }
    }
    
    private function checkRedisLimit(string $key): bool {
        if (!$this->redis instanceof \Redis) {
            return true; // Fail open if Redis is not available
        }
        
        $current = $this->redis->get($key);
        
        if (!$current) {
            $this->redis->setex($key, $this->timeWindow, 1);
            return true;
        }
        
        if ((int)$current >= $this->maxRequests) {
            return false;
        }
        
        $this->redis->incr($key);
        return true;
    }
    
    private function checkFileLimit(string $key): bool {
        $file = sys_get_temp_dir() . '/' . md5($key) . '.txt';
        
        if (!file_exists($file)) {
            file_put_contents($file, json_encode([
                'count' => 1,
                'timestamp' => time()
            ]));
            return true;
        }
        
        $data = json_decode(file_get_contents($file), true);
        
        if (time() - $data['timestamp'] > $this->timeWindow) {
            $data = [
                'count' => 1,
                'timestamp' => time()
            ];
        } else if ($data['count'] >= $this->maxRequests) {
            return false;
        } else {
            $data['count']++;
        }
        
        file_put_contents($file, json_encode($data));
        return true;
    }
    
    public function getRemainingLimit(string $identifier): int {
        $key = "rate_limit:" . $identifier;
        
        if ($this->redis instanceof \Redis) {
            $current = (int)($this->redis->get($key) ?: 0);
            return $this->maxRequests - $current;
        } else {
            $file = sys_get_temp_dir() . '/' . md5($key) . '.txt';
            if (!file_exists($file)) {
                return $this->maxRequests;
            }
            $data = json_decode(file_get_contents($file), true);
            if (time() - $data['timestamp'] > $this->timeWindow) {
                return $this->maxRequests;
            }
            return $this->maxRequests - $data['count'];
        }
    }
}
