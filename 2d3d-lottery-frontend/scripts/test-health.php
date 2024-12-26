<?php
// Set test environment variables
putenv("DB_HOST=localhost");
putenv("DB_NAME=2d3d_lottery");
putenv("DB_USER=postgres");
putenv("DB_PASS=postgres");
putenv("DB_PORT=5432");

echo "Testing health check endpoint...\n";

// Make request to health endpoint
$response = file_get_contents('http://localhost:8000/health.php');
$health = json_decode($response, true);

echo "Response:\n";
echo json_encode($health, JSON_PRETTY_PRINT) . "\n";

// Verify response
if ($health['status'] === 'healthy' && 
    $health['checks']['database']['status'] === 'connected') {
    echo "\nHealth check passed! ✅\n";
    exit(0);
} else {
    echo "\nHealth check failed! ❌\n";
    exit(1);
} 