@echo off
title BKI — React Frontend
echo.
echo  ============================================================
echo   BKI React Frontend (Vite Dev Server)
echo   Ensuring packages are installed...
echo  ============================================================
echo.
cd /d "%~dp0client"
call npm install
echo.
echo  Starting Vite Dev Server...
call npm run dev
pause
