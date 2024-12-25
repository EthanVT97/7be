<?php

namespace App\Exceptions;

use Exception;

class HttpException extends Exception
{
    protected $statusCode;

    public function __construct(string $message = "", int $code = 500, Exception $previous = null)
    {
        $this->statusCode = $code;
        parent::__construct($message, $code, $previous);
    }

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }
} 