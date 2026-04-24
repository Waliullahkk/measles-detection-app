#!/bin/bash
# Measles Detection App - Frontend Startup Script

echo ""
echo "========================================"
echo "  Measles Detection - Frontend Startup"
echo "========================================"
echo ""

cd frontend

echo "[*] Checking Node.js installation..."
node --version
npm --version

echo ""
echo "[*] Installing dependencies (this may take a minute)..."
npm install

echo ""
echo "[*] Starting React development server..."
echo "[*] Server will run on: http://localhost:3000"
echo "[*] Press Ctrl+C to stop the server"
echo ""

npm start
