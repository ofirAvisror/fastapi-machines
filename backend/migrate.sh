#!/bin/bash
# Database Migration Script for Linux/Mac/Git Bash
# Usage: ./migrate.sh "description of change"

if [ -z "$1" ]; then
    echo "Usage: ./migrate.sh \"description of change\""
    echo "Example: ./migrate.sh \"Add phone field\""
    exit 1
fi

# Detect OS and set alembic path
if [ -f "venv/Scripts/alembic.exe" ]; then
    # Windows (Git Bash)
    ALEMBIC="venv/Scripts/alembic.exe"
else
    # Linux/Mac
    ALEMBIC="./venv/bin/alembic"
fi

echo ""
echo "==================================="
echo "  Creating Migration"
echo "==================================="
$ALEMBIC revision --autogenerate -m "$1"

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to create migration!"
    exit 1
fi

echo ""
echo "==================================="
echo "  Applying Migration"
echo "==================================="
$ALEMBIC upgrade head

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to apply migration!"
    exit 1
fi

echo ""
echo "==================================="
echo "  Migration Complete!"
echo "==================================="
echo ""

