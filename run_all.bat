@echo off
echo =====================================================================
echo  AI-Based Crypto Market Prediction & Educational Assistant System
echo  Authors: Farhan Ijaz (23L-0568) & Zain-ul-Abideen (23L-0858)
echo =====================================================================
echo.

echo [1/3] Starting Python FastAPI AI Service on port 8000...
start "NeuroCrypto - Python AI Service (Port 8000)" cmd /k "cd ai_service && python main.py"

timeout /t 2 /nobreak > nul

echo [2/3] Starting Express + MongoDB Backend API on port 5000...
start "NeuroCrypto - Node.js Backend API (Port 5000)" cmd /k "cd backend && npm start"

timeout /t 2 /nobreak > nul

echo [3/3] Starting React Vite Frontend on port 5173...
start "NeuroCrypto - React Vite Frontend (Port 5173)" cmd /k "cd frontend && npm run dev"

echo.
echo All services launched!
echo Access the Application at: http://localhost:5173
echo Express API documentation: http://localhost:5000
echo Python FastAPI Swagger Docs: http://localhost:8000/docs
echo =====================================================================
