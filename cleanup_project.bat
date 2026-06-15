@echo off
title BKI Website — Project Cleanup
color 0E
echo.
echo  ============================================================
echo   BKI Website — Cleanup Legacy and Backup Files
echo  ============================================================
echo.
echo  This script will permanently delete the following legacy folders/files:
echo   - backend/           (Legacy Node server backup)
echo   - frontend/          (Legacy Vanilla HTML/JS backup)
echo   - frames/            (Legacy frames source — now in client/public/frames)
echo   - find_watermark.py  (Utility script)
echo   - run_website.bat    (Legacy local runner)
echo   - index.html         (Root Flowchart Designer HTML)
echo   - script.js          (Root Flowchart Designer JS)
echo   - style.css          (Root Flowchart Designer CSS)
echo.
set /p confirm="Are you sure you want to proceed? (Y/N): "
if /i "%confirm%" neq "Y" (
    echo Cleanup cancelled.
    pause
    exit /b 0
)

echo.
echo  Removing directories...
if exist "backend" (
    rmdir /s /q "backend"
    echo   [OK] Removed backend/
)
if exist "frontend" (
    rmdir /s /q "frontend"
    echo   [OK] Removed frontend/
)
if exist "frames" (
    rmdir /s /q "frames"
    echo   [OK] Removed frames/
)

echo.
echo  Removing files...
if exist "find_watermark.py" (
    del /f /q "find_watermark.py"
    echo   [OK] Removed find_watermark.py
)
if exist "run_website.bat" (
    del /f /q "run_website.bat"
    echo   [OK] Removed run_website.bat
)
if exist "index.html" (
    del /f /q "index.html"
    echo   [OK] Removed index.html
)
if exist "script.js" (
    del /f /q "script.js"
    echo   [OK] Removed script.js
)
if exist "style.css" (
    del /f /q "style.css"
    echo   [OK] Removed style.css
)

echo.
echo  ============================================================
echo   CLEANUP COMPLETE!
echo   Only the active React client, Express server, and startup
echo   scripts remain.
echo  ============================================================
echo.
pause

:: Self-delete this batch file
(goto) 2>nul & del "%~f0"
