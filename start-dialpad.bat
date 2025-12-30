@echo off
echo =======================================
echo   DIALPAD AUTO-ANSWER SYSTEM
echo =======================================
echo.
echo Starting in 3 seconds...
timeout /t 3 /nobreak >nul
node dialpad-autoanswer.js
