#!/bin/bash

echo "Running pre-deployment checks..."

# Check if start.sh is executable
if [ -x "docker/start.sh" ]; then
    echo "✅ start.sh is executable"
else
    echo "❌ start.sh is not executable"
    echo "Run: chmod +x docker/start.sh"
    exit 1
fi

# Test database connection
echo -n "Testing database connection... "
if php public/api/test/database.php > /dev/null; then
    echo "✅"
else
    echo "❌"
    echo "Database connection failed"
    exit 1
fi

# Test health check
echo -n "Testing health check endpoint... "
if php scripts/test-health.php > /dev/null; then
    echo "✅"
else
    echo "❌"
    echo "Health check failed"
    exit 1
fi

# Verify environment variables
echo -n "Verifying environment variables... "
if php scripts/verify-env.php > /dev/null; then
    echo "✅"
else
    echo "❌"
    echo "Environment variables check failed"
    exit 1
fi

echo -e "\nPre-deployment checks completed successfully! ✅"
echo "You can now deploy to Render." 