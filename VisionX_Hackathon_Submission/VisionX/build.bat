@echo off
title VisionX - Build Production
echo ============================================================
echo   VISIONX : Building Production Bundle
echo ============================================================
echo.
call npm run build
echo.
echo Build complete! Ready files located in /dist
pause
