#!/bin/bash

# Exit on error
set -e

# Load environment variables
if [ -f .env ]; then
    source .env
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build and deploy the application
echo "🚀 Starting deployment..."

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Install dependencies and build
echo "🔨 Installing dependencies and building..."
npm install
npm run build

# Build Docker images
echo "🐳 Building Docker images..."
docker-compose build

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Start new containers
echo "🚀 Starting new containers..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Run database migrations
echo "🔄 Running database migrations..."
docker-compose exec backend npm run migrate

# Check services health
echo "🏥 Checking services health..."
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend health check failed"
    exit 1
fi

if curl -f http://localhost:8080/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
    exit 1
fi

# Clean up
echo "🧹 Cleaning up..."
docker system prune -f

echo "✨ Deployment completed successfully!"

# Print URLs
echo "
📱 Application URLs:
Frontend: http://localhost
Backend API: http://localhost:8080
WebSocket: ws://localhost:8080/ws
"

# Print logs
echo "📋 Recent logs:"
docker-compose logs --tail=50 