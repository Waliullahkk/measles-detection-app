@echo off
REM Measles Detection App - Backend Startup Script

echo.
echo ========================================
echo   Measles Detection - Backend Startup
echo ========================================
echo.

cd backend

echo [*] Checking Python installation...
python --version

echo.
echo [*] Installing dependencies...
pip install -r requirements.txt

echo.
echo [*] Starting Flask server...
echo [*] Server will run on: http://127.0.0.1:5000
echo [*] Press Ctrl+C to stop the server
echo.

python app.py

pause
