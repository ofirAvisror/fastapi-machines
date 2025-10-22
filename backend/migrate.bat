@echo off
REM Database Migration Script for Windows
REM Usage: migrate.bat "description of change"

if "%1"=="" (
    echo Usage: migrate.bat "description of change"
    echo Example: migrate.bat "Add phone field"
    exit /b 1
)

echo.
echo ===================================
echo   Creating Migration
echo ===================================
call venv\Scripts\alembic.exe revision --autogenerate -m %1

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to create migration!
    exit /b 1
)

echo.
echo ===================================
echo   Applying Migration
echo ===================================
call venv\Scripts\alembic.exe upgrade head

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to apply migration!
    exit /b 1
)

echo.
echo ===================================
echo   Migration Complete!
echo ===================================
echo.

