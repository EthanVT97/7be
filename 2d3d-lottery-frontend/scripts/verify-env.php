<?php
// Required environment variables
$required_vars = [
    'DB_HOST',
    'DB_NAME', 
    'DB_USER',
    'DB_PASS',
    'JWT_SECRET',
    'CORS_ORIGIN',
    'APP_ENV',
    'APP_DEBUG'
];

echo "Verifying environment variables...\n\n";

$missing = [];
$configured = [];

foreach ($required_vars as $var) {
    if (getenv($var)) {
        $configured[] = $var;
    } else {
        $missing[] = $var;
    }
}

if (!empty($configured)) {
    echo "✅ Configured variables:\n";
    foreach ($configured as $var) {
        echo "   - $var\n";
    }
}

if (!empty($missing)) {
    echo "\n❌ Missing variables:\n";
    foreach ($missing as $var) {
        echo "   - $var\n";
    }
    exit(1);
}

echo "\nAll environment variables are properly configured! ✅\n";
exit(0); 