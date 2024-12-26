<?php

namespace App\Cache;

use App\Interfaces\CacheInterface;
use Predis\Client;
use Predis\Connection\ConnectionException;
use Predis\Response\ServerException;

class RedisClient implements CacheInterface
{
    private ?Client $client = null;
    private array $config;
    private bool $connected = false;

    public function __construct(array $config = [])
    {
        $this->config = array_merge([
            'scheme' => 'tcp',
            'host' => $_ENV['REDIS_HOST'] ?? 'localhost',
            'port' => (int)($_ENV['REDIS_PORT'] ?? 6379),
            'password' => $_ENV['REDIS_PASSWORD'] ?? null,
            'database' => 0,
            'read_write_timeout' => 0,
            'connection_timeout' => 2.0,
            'reconnect_attempts' => 3,
            'reconnect_delay' => 1000
        ], $config);
    }

    private function connect(): void
    {
        if ($this->connected && $this->client !== null) {
            return;
        }

        try {
            $this->client = new Client($this->config, [
                'exceptions' => true,
                'prefix' => 'app:'
            ]);

            // Test connection
            $this->client->ping();
            $this->connected = true;

        } catch (ConnectionException $e) {
            $this->connected = false;
            $this->client = null;
            error_log('Redis connection failed: ' . $e->getMessage());
            throw $e;
        }
    }

    public function get(string $key): ?string
    {
        try {
            $this->connect();
            $result = $this->client?->get($key);
            return $result !== false ? $result : null;

        } catch (ConnectionException $e) {
            error_log('Redis get error: ' . $e->getMessage());
            return null;

        } catch (ServerException $e) {
            error_log('Redis server error during get: ' . $e->getMessage());
            return null;
        }
    }

    public function setex(string $key, int $seconds, string $value): bool
    {
        try {
            $this->connect();
            $result = $this->client?->setex($key, $seconds, $value);
            return $result === 'OK';

        } catch (ConnectionException $e) {
            error_log('Redis setex error: ' . $e->getMessage());
            return false;

        } catch (ServerException $e) {
            error_log('Redis server error during setex: ' . $e->getMessage());
            return false;
        }
    }

    public function disconnect(): void
    {
        if ($this->client !== null && $this->connected) {
            try {
                $this->client->disconnect();
            } catch (ConnectionException $e) {
                error_log('Redis disconnect error: ' . $e->getMessage());
            } finally {
                $this->connected = false;
                $this->client = null;
            }
        }
    }

    public function __destruct()
    {
        $this->disconnect();
    }
} 