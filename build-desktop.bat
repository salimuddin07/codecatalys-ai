@echo off
echo 🚀 Building CodeCatalyst AI Desktop App...
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

:: Check if package.json exists
if not exist package.json (
    echo ❌ package.json not found. Please run this script from the project directory.
    pause
    exit /b 1
)

echo ✅ Node.js found
echo.

:: Install dependencies
echo 📦 Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed
echo.

:: Build the Electron app
echo 🔨 Building Electron application...
npm run dist
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo.
echo ✅ Build completed successfully!
echo 📁 Check the 'dist-electron' folder for your installer
echo.

:: Open the dist folder
if exist "dist-electron" (
    echo Opening dist-electron folder...
    start "" "dist-electron"
)

pause
