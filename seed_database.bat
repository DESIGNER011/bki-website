@echo off
title BKI — Seed Database
echo.
echo  ============================================================
echo   Seeding MongoDB Atlas from backend/db.json
echo  ============================================================
echo.
cd /d "%~dp0server"
node seed.js
pause
