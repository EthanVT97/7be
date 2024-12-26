#!/bin/bash

# Check if Apache is running
if ! pgrep apache2 > /dev/null; then
    echo "Apache is not running"
    exit 1
fi

# Get port from environment or default to 80
PORT=${PORT:-80}

# Try to fetch the health endpoint
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:${PORT}/health)

if [ "$response" = "200" ]; then
    echo "Health check passed"
    exit 0
else
    echo "Health check failed with status code: $response"
    exit 1
fi 