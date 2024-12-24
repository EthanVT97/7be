<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/types.php';

try {
    $redis = new \Redis();
    $redis->connect('127.0.0.1', 6379);
    
    echo "Redis connection test:\n";
    
    // Test set
    $redis->set('test_key', 'Hello Redis!');
    echo "Set value: ", $redis->get('test_key'), "\n";
    
    // Test expiry
    $redis->setex('test_expiry', 10, 'This will expire in 10 seconds');
    echo "Expiring value: ", $redis->get('test_expiry'), "\n";
    echo "TTL: ", $redis->ttl('test_expiry'), " seconds\n";
    
    // Test increment
    $redis->set('counter', 0);
    $redis->incr('counter');
    echo "Counter: ", $redis->get('counter'), "\n";
    
    echo "\nRedis is working correctly!";
    
} catch (\Exception $e) {
    echo "Error: ", $e->getMessage();
}
