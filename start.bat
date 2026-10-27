@echo off
title VisionX - Autonomous Household Robot
echo ============================================================
echo   VISIONX : Autonomous Household Robot Simulation
echo ============================================================
echo.
echo [1/2] Checking dependencies...
if not exist node_modules (
    echo Installing npm dependencies...
    call npm install
)
echo.
echo [2/2] Launching interactive 3D simulation server...
echo Local URL: http://localhost:5173
echo.
call npm run dev
pause
