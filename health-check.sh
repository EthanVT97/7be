#!/bin/bash

# Check if nginx is running
if ! pgrep nginx > /dev/null; then
    echo "Nginx is not running"
    exit 1
fi

# Check if we can connect to nginx
if ! curl -f http://localhost/health > /dev/null 2>&1; then
    echo "Cannot connect to nginx"
    exit 1
fi

# All checks passed
echo "Health check passed"
exit 0 