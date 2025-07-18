@echo off
cls
echo ===============================================
echo   CodeCatalyst AI - Professional PWA Server
echo ===============================================
echo.
echo 🚀 Starting Professional Development Environment
echo.
echo Project Structure:
echo   📁 /html/          - HTML pages and components
echo   📁 /js/            - JavaScript modules
echo   📁 /css/           - Stylesheets and themes
echo   📁 /assets/        - Images, icons, fonts
echo   📁 /tools/         - Development utilities
echo   📁 /scripts/       - Build and automation scripts
echo   📁 /docs/          - Documentation
echo.

REM Check if we're in the right directory
if not exist "manifest.json" (
    echo ❌ Error: Please run this from the project root directory
    echo Looking for manifest.json...
    pause
    exit /b 1
)

echo ✅ Project structure verified
echo.

REM Try to start with Python first
echo [1/3] Checking Python HTTP Server...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo.
    echo ✅ Python found! Starting professional server on port 8000
    echo.
    echo 🌐 Professional PWA URLs:
    echo    Main Application:     http://localhost:8000
    echo    Project Structure:    http://localhost:8000/project-structure.html
    echo    Mobile Install Test:  http://localhost:8000/html/mobile-install-test.html
    echo    PWA Test Suite:       http://localhost:8000/html/pwa-test.html
    echo    Icon Generator:       http://localhost:8000/tools/quick-icon-generator.html
    echo    Install Guide:        http://localhost:8000/html/install.html
    echo.
    echo 📱 For mobile testing use your IP:
    echo    Mobile URL: http://172.28.189.188:8000
    echo.
    echo 💡 Professional Features:
    echo    ✅ Organized folder structure
    echo    ✅ Progressive Web App ready
    echo    ✅ Mobile installation support
    echo    ✅ Offline functionality
    echo    ✅ Professional navigation
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
    echo Starting Professional Node.js HTTP server on port 8000
    echo.
    echo 🌐 Professional PWA URLs:
    echo    Main Application:     http://localhost:8000
    echo    Project Structure:    http://localhost:8000/project-structure.html
    echo    Mobile Install Test:  http://localhost:8000/html/mobile-install-test.html
    echo    Icon Generator:       http://localhost:8000/tools/quick-icon-generator.html
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
echo 📋 Professional Setup Options:
echo.
echo Option 1 - Install Python (Recommended):
echo   1. Go to https://python.org
echo   2. Download and install Python 3.x
echo   3. Run this script again
echo.
echo Option 2 - Install Node.js:
echo   1. Go to https://nodejs.org
echo   2. Download and install Node.js LTS
echo   3. Run this script again
echo.
echo Option 3 - Use VS Code Live Server:
echo   1. Install "Live Server" extension in VS Code
echo   2. Right-click on index.html
echo   3. Select "Open with Live Server"
echo.
echo Option 4 - Deploy to Professional Hosting:
echo   1. Upload to Netlify, Vercel, or GitHub Pages
echo   2. Test PWA installation from live URL
echo   3. Share professional URL with clients
echo.

:end
echo.
echo ===============================================
echo Thank you for using CodeCatalyst AI Professional!
echo Your project is now organized with industry standards
echo ===============================================
pause
