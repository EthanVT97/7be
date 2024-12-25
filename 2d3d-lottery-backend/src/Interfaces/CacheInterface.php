<?php

namespace App\Interfaces;

interface CacheInterface
{
    public function get(string $key): ?string;
    public function setex(string $key, int $seconds, string $value): bool;
    public function disconnect(): void;
} 