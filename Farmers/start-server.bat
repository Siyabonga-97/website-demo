@echo off
echo Starting local web server for Digital Farmers...
echo.
echo Trying different server options...
echo.

REM Try Python first
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Python HTTP server...
    echo Open http://localhost:8000 in your browser
    echo Press Ctrl+C to stop the server
    echo.
    python -m http.server 8000
    goto :end
)

REM Try Node.js if Python fails
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Node.js HTTP server...
    echo Open http://localhost:8000 in your browser
    echo Press Ctrl+C to stop the server
    echo.
    npx http-server -p 8000
    goto :end
)

REM If neither works, show instructions
echo Neither Python nor Node.js found!
echo.
echo Please install one of the following:
echo 1. Python: https://python.org/downloads
echo 2. Node.js: https://nodejs.org/downloads
echo.
echo Or use VS Code Live Server extension
echo.
pause

:end
