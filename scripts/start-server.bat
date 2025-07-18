@echo off
echo 🌐 Starting CodeCatalyst AI Local Server...
echo.

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Python found - Starting server on http://localhost:8000
    echo Press Ctrl+C to stop the server
    echo.
    python -m http.server 8000
    goto :end
)

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js found - Installing simple server...
    npm install -g http-server
    echo Starting server on http://localhost:8080
    echo Press Ctrl+C to stop the server
    echo.
    npx http-server -p 8080 -o
    goto :end
)

:: If neither is found
echo ❌ Neither Python nor Node.js found.
echo Please install one of them to run a local server:
echo - Python: https://python.org/
echo - Node.js: https://nodejs.org/
echo.
echo Alternatively, you can open index.html directly in your browser.

:end
pause
