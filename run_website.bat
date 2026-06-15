@echo off
title BKI — Run Localhost Website
echo.
echo  ============================================================
echo   Best Karate of India — Localhost Website Launcher
echo  ============================================================
echo.
echo  Starting Backend Server in a new window...
start cmd /c "call "%~dp0start_server.bat""

echo  Starting React Frontend in a new window...
start cmd /c "call "%~dp0start_client.bat""

echo.
echo  Both servers are launching in separate windows!
echo  Open http://localhost:5173 in your browser once loaded.
echo.
pause
