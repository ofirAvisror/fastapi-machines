#!/usr/bin/env python
"""
Fix SQLModel imports in the latest Alembic migration file.
This script adds 'import sqlmodel' to the latest migration if it's missing.
"""

import os
import re
from pathlib import Path

def fix_latest_migration():
    """Add 'import sqlmodel' to the latest migration file if missing."""
    
    # Find the alembic versions directory
    versions_dir = Path("alembic/versions")
    
    if not versions_dir.exists():
        print("❌ Error: alembic/versions directory not found!")
        return False
    
    # Get all migration files
    migration_files = sorted(versions_dir.glob("*.py"), key=os.path.getmtime, reverse=True)
    
    if not migration_files:
        print("❌ No migration files found!")
        return False
    
    latest_migration = migration_files[0]
    print(f"📝 Checking: {latest_migration.name}")
    
    # Read the file
    content = latest_migration.read_text(encoding='utf-8')
    
    # Check if sqlmodel is already imported
    if 'import sqlmodel' in content:
        print("✅ Migration already has 'import sqlmodel'")
        return True
    
    # Check if sqlmodel is used in the file
    if 'sqlmodel.' not in content:
        print("ℹ️ Migration doesn't use sqlmodel - no fix needed")
        return True
    
    # Add the import after sqlalchemy import
    pattern = r'(import sqlalchemy as sa)\n'
    replacement = r'\1\nimport sqlmodel\n'
    
    new_content = re.sub(pattern, replacement, content)
    
    if new_content != content:
        # Write back the fixed content
        latest_migration.write_text(new_content, encoding='utf-8')
        print(f"✅ Fixed! Added 'import sqlmodel' to {latest_migration.name}")
        return True
    else:
        print("❌ Could not fix the migration file automatically")
        print("Please add 'import sqlmodel' manually after 'import sqlalchemy as sa'")
        return False

if __name__ == "__main__":
    print("\n" + "="*50)
    print("  Fixing SQLModel Import in Latest Migration")
    print("="*50 + "\n")
    
    if fix_latest_migration():
        print("\n✅ Done!\n")
        exit(0)
    else:
        print("\n❌ Fix failed!\n")
        exit(1)

