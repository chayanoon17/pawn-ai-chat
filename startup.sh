#!/bin/bash

# Azure App Service startup script
echo "Starting Azure App Service..."

# Ensure .next directory exists
mkdir -p .next

# Run build if .next/BUILD_ID doesn't exist
if [ ! -f ".next/BUILD_ID" ]; then
    echo "Building Next.js application..."
    npm run build
fi

# Start the application
echo "Starting Node.js server..."
node server.js
