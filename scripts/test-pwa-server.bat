@echo off
echo Starting CodeCatalyst AI PWA Server...
echo.
echo This will start a local HTTPS server required for PWA testing
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

REM Try to start with Python simple server first
echo Starting Python HTTP server on port 8000...
echo.
echo Open your browser and go to:
echo http://localhost:8000
echo.
echo For PWA testing, open:
echo http://localhost:8000/pwa-test.html
echo.
echo Press Ctrl+C to stop the server
echo.

python -m http.server 8000
