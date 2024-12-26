<?php
// Load environment variables
$envFile = __DIR__ . '/../.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            list($key, $value) = explode('=', $line, 2);
            putenv(trim($key) . '=' . trim($value));
            $_ENV[trim($key)] = trim($value);
        }
    }
}

// Database configuration
define('DB_HOST', getenv('DB_HOST') ?: 'dpg-ctm70o9opnds73fdciig-a.singapore-postgres.render.com');
define('DB_PORT', getenv('DB_PORT') ?: '5432');
define('DB_NAME', getenv('DB_NAME') ?: 'db_2d3d_lottery_db');
define('DB_USER', getenv('DB_USER') ?: 'db_2d3d_lottery_db_user');
define('DB_PASS', getenv('DB_PASS') ?: 'ZcV5s0MAJrFxPyYfQFr7lJFADwxFAn6b');

// Site configuration
define('SITE_NAME', '2D3D Lottery');
define('SITE_URL', getenv('SITE_URL') ?: 'https://twod3d-lottery.onrender.com');

// Initialize database connection
try {
    // Build DSN with SSL requirements for Render.com
    $dsn = sprintf(
        "pgsql:host=%s;port=%s;dbname=%s;sslmode=require;sslcert=;sslkey=;sslrootcert=",
        DB_HOST,
        DB_PORT,
        DB_NAME
    );
    
    // Connection options optimized for Render.com
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_PERSISTENT => true,
        PDO::ATTR_TIMEOUT => 5,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_STRINGIFY_FETCHES => false
    ];

    // Attempt connection with retries
    $maxRetries = 3;
    $retryDelay = 1;
    $attempt = 0;
    $lastError = null;

    while ($attempt < $maxRetries) {
        try {
            $conn = new PDO($dsn, DB_USER, DB_PASS, $options);
            // Test the connection
            $conn->query('SELECT 1');
            break;
        } catch (PDOException $e) {
            $lastError = $e;
            $attempt++;
            if ($attempt < $maxRetries) {
                sleep($retryDelay);
                continue;
            }
            throw $e;
        }
    }

} catch (PDOException $e) {
    error_log("Database Connection Error: " . $e->getMessage());
    die(json_encode([
        'status' => 'error',
        'message' => 'Database connection failed',
        'error' => $e->getMessage()
    ]));
}

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
