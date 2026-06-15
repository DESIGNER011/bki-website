@echo off
title BKI — Backend Server
echo.
echo  ============================================================
echo   BKI Backend Server (Express + MongoDB + Cloudinary)
echo   Port: 5000
echo  ============================================================
echo.
echo  Make sure you have filled in server\.env with:
echo    - MONGO_URI  (from MongoDB Atlas)
echo    - CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
echo.
cd /d "%~dp0server"
call npm run dev
pause
