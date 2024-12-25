<?php
declare(strict_types=1);

/**
 * Type definitions for Redis class when the extension is not loaded
 * @phpstan-type Redis class
 */
if (!extension_loaded('redis')) {
    class Redis {
        /**
         * @param string $host
         * @param int $port
         * @param float $timeout
         * @param mixed $reserved
         * @param int $retryInterval
         * @param float $readTimeout
         * @return bool
         */
        public function connect(
            string $host,
            int $port,
            float $timeout = 0.0,
            mixed $reserved = null,
            int $retryInterval = 0,
            float $readTimeout = 0.0
        ): bool {
            throw new \RuntimeException('Redis extension not loaded');
        }

        /**
         * @param string $key
         * @param int $ttl
         * @param mixed $value
         * @return bool
         */
        public function setex(string $key, int $ttl, mixed $value): bool {
            throw new \RuntimeException('Redis extension not loaded');
        }

        /**
         * @param string $key
         * @return mixed
         */
        public function get(string $key): mixed {
            throw new \RuntimeException('Redis extension not loaded');
        }

        /**
         * @param string $key
         * @param mixed $value
         * @param mixed $options
         * @return bool
         */
        public function set(string $key, mixed $value, mixed $options = null): bool {
            throw new \RuntimeException('Redis extension not loaded');
        }

        /**
         * @param string|array $key
         * @param string ...$keys
         * @return int
         */
        public function del(string|array $key, string ...$keys): int {
            throw new \RuntimeException('Redis extension not loaded');
        }

        /**
         * @return bool
         */
        public function flushAll(): bool {
            throw new \RuntimeException('Redis extension not loaded');
        }

        /**
         * @param string $key
         * @return int
         */
        public function incr(string $key): int {
            throw new \RuntimeException('Redis extension not loaded');
        }

        /**
         * @param string $key
         * @return int
         */
        public function ttl(string $key): int {
            throw new \RuntimeException('Redis extension not loaded');
        }
    }
}
