@echo off
echo ===============================================
echo   CodeCatalyst AI - PWA Development Server
echo ===============================================
echo.
echo Starting local development server...
echo This will help you test the PWA installation
echo.

REM Check if we're in the right directory
if not exist "manifest.json" (
    echo Error: Please run this from the project root directory
    echo Looking for manifest.json...
    pause
    exit /b 1
)

REM Try to start with Python first
echo [1/3] Trying Python HTTP Server...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo.
    echo ✅ Python found! Starting server on port 8000
    echo.
    echo 📱 Open these URLs to test your PWA:
    echo    Main App: http://localhost:8000
    echo    Install Page: http://localhost:8000/install.html
    echo    Icon Generator: http://localhost:8000/create-icons.html
    echo.
    echo 💡 Tips for testing PWA installation:
    echo    - Use Chrome or Edge for best results
    echo    - For mobile testing, use Chrome DevTools device simulation
    echo    - Look for the install button in the address bar
    echo.
    echo Press Ctrl+C to stop the server
    echo ===============================================
    python -m http.server 8000
    goto :end
)

REM Try Node.js if Python fails
echo [2/3] Python not found, trying Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo.
    echo ✅ Node.js found! Installing http-server...
    npx http-server --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo Installing http-server...
        npm install -g http-server
    )
    echo.
    echo Starting Node.js HTTP server on port 8000
    echo.
    echo 📱 Open these URLs to test your PWA:
    echo    Main App: http://localhost:8000
    echo    Install Page: http://localhost:8000/install.html
    echo    Icon Generator: http://localhost:8000/create-icons.html
    echo.
    echo Press Ctrl+C to stop the server
    echo ===============================================
    npx http-server -p 8000
    goto :end
)

REM If both fail, show manual instructions
echo [3/3] Neither Python nor Node.js found
echo.
echo ❌ Could not start automatic server
echo.
echo 📋 Manual Setup Options:
echo.
echo Option 1 - Install Python:
echo   1. Go to https://python.org
echo   2. Download and install Python
echo   3. Run this script again
echo.
echo Option 2 - Install Node.js:
echo   1. Go to https://nodejs.org
echo   2. Download and install Node.js
echo   3. Run this script again
echo.
echo Option 3 - Use VS Code Live Server:
echo   1. Install "Live Server" extension in VS Code
echo   2. Right-click on index.html
echo   3. Select "Open with Live Server"
echo.
echo Option 4 - Deploy to free hosting:
echo   1. Upload files to Netlify, Vercel, or GitHub Pages
echo   2. Test PWA installation from the live URL
echo.

:end
echo.
echo ===============================================
echo Thanks for using CodeCatalyst AI!
echo ===============================================
pause
