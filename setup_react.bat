@echo off
title BKI — React Migration Setup
echo.
echo  ============================================================
echo   BKI Website — React + Node.js + MongoDB Setup Script
echo  ============================================================
echo.

echo  [Step 1/4] Installing server dependencies...
cd /d "%~dp0server"
call npm install
if %errorlevel% neq 0 (
    echo  ERROR: npm install failed in server/
    pause
    exit /b 1
)
echo  Server dependencies installed!
echo.

echo  [Step 2/3] Installing client dependencies...
cd /d "%~dp0client"
call npm install
if %errorlevel% neq 0 (
    echo  ERROR: npm install failed in client/
    pause
    exit /b 1
)
echo  Client dependencies installed!
echo.

echo  [Step 3/3] Copying animation frames to client/public/frames/...
cd /d "%~dp0"
if not exist "client\public\frames" mkdir "client\public\frames"
xcopy /E /I /Y "frames\*" "client\public\frames\"
echo  Frames copied!
echo.

echo  ============================================================
echo   SETUP COMPLETE!
echo  ============================================================
echo.
echo   NEXT STEPS:
echo   1. Fill in your credentials in server\.env:
echo      - MONGO_URI  (from MongoDB Atlas Dashboard)
echo      - CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
echo        (from cloudinary.com Dashboard)
echo.
echo   2. Seed the database:
echo      cd server
echo      node seed.js
echo.
echo   3. Start the backend (in one terminal):
echo      cd server
echo      npm run dev
echo.
echo   4. Start the frontend (in another terminal):
echo      cd client
echo      npm run dev
echo.
echo   5. Open browser at: http://localhost:5173
echo.
pause
