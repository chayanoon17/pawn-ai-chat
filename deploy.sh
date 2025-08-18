#!/bin/bash

# Docker Build and Deploy Script for Pawn AI Chat

set -e

echo "🚀 Starting Docker deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Build the Docker image
print_status "Building Docker image..."
docker build -t pawn-ai-chat:latest .

if [ $? -eq 0 ]; then
    print_status "Docker image built successfully!"
else
    print_error "Failed to build Docker image!"
    exit 1
fi

# Ask user for deployment type
echo ""
echo "Select deployment type:"
echo "1) Development (docker-compose.yml)"
echo "2) Production (docker-compose.prod.yml)"
read -p "Enter your choice (1 or 2): " choice

case $choice in
    1)
        print_status "Starting development deployment..."
        docker-compose down --remove-orphans
        docker-compose up -d
        ;;
    2)
        print_status "Starting production deployment..."
        docker-compose -f docker-compose.prod.yml down --remove-orphans
        docker-compose -f docker-compose.prod.yml up -d
        ;;
    *)
        print_error "Invalid choice. Please select 1 or 2."
        exit 1
        ;;
esac

if [ $? -eq 0 ]; then
    print_status "Deployment completed successfully!"
    echo ""
    print_status "Your application is now running!"
    
    if [ $choice -eq 1 ]; then
        print_status "Development URL: http://localhost:3000"
    else
        print_status "Production URL: Configure your domain in docker-compose.prod.yml"
    fi
    
    echo ""
    print_status "Useful commands:"
    echo "  - View logs: docker-compose logs -f"
    echo "  - Stop: docker-compose down"
    echo "  - Restart: docker-compose restart"
else
    print_error "Deployment failed!"
    exit 1
fi
