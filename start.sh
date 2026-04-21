#!/bin/bash
set -e

echo "🚀 Starting Performance Review System Backend"

# Navigate to backend directory
cd backend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing backend dependencies..."
  npm ci --production
fi

# Start the backend server
echo "🚀 Backend starting on port 3001"
npm run start:prod
