#!/bin/bash

echo "🚀 Building CodeCatalyst AI Desktop App..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the project directory."
    exit 1
fi

echo "✅ Node.js found"
echo

# Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo

# Build the Electron app
echo "🔨 Building Electron application..."
npm run dist
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo
echo "✅ Build completed successfully!"
echo "📁 Check the 'dist-electron' folder for your installer"
echo

# Open the dist folder (macOS/Linux)
if [ -d "dist-electron" ]; then
    if command -v open &> /dev/null; then
        open dist-electron
    elif command -v xdg-open &> /dev/null; then
        xdg-open dist-electron
    fi
fi
