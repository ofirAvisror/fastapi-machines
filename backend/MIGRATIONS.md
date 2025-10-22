# Database Migrations Guide

## Quick Guide

When adding a new field to `app/models.py`, run:

### Windows:

```bash
migrate.bat "description of change"
```

### Linux/Mac:

```bash
chmod +x migrate.sh
./migrate.sh "description of change"
```

**That's it!** The database updates automatically!

---

## Complete Example

### 1. Edit the model:

```python
# app/models.py
class MachineBase(SQLModel):
    name: str
    location: str
    phone: Optional[str] = Field(default="")  # New field!
```

### 2. Run migration:

```bash
# Windows
migrate.bat "Add phone field"

# Linux/Mac
./migrate.sh "Add phone field"
```

### 3. Server restarts (if --reload is active)

Frontend sees the new field immediately!

---

## Manual Commands (if you want full control)

### Create new migration:

```bash
alembic revision --autogenerate -m "description of change"
```

### Apply migrations:

```bash
alembic upgrade head
```

### Show history:

```bash
alembic history
```

### Rollback (downgrade):

```bash
alembic downgrade -1    # Go back one version
alembic downgrade base  # Go back to beginning
```

### Show current status:

```bash
alembic current
```

---

## Important to Know

### What Alembic does:

- Preserves all data
- Adds/modifies columns
- Keeps history of changes
- Allows rollback

### What happens behind the scenes:

1. `revision --autogenerate` - Compares models.py to DB and creates migration file
2. `upgrade head` - Runs the migration on the DB (e.g., `ALTER TABLE ADD COLUMN`)

### Example - Adding a column:

```sql
-- Alembic runs approximately:
ALTER TABLE machine ADD COLUMN phone VARCHAR;
UPDATE machine SET phone = '' WHERE phone IS NULL;
```

**All old data is preserved!**

---

## Troubleshooting

### Issue: "Can't locate revision"

```bash
# Clean the DB and start fresh:
python -c "import sqlite3; conn = sqlite3.connect('machines.db'); conn.execute('DROP TABLE IF EXISTS alembic_version'); conn.commit()"
alembic stamp head
```

### Issue: "Target database is not up to date"

```bash
alembic upgrade head
```

### Issue: Server doesn't see changes

1. Ensure server runs with `--reload`
2. If not - restart it manually (Ctrl+C then `uvicorn...`)

---

## For More Information

- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com/)

---

## Migration Workflow

```
models.py (add field)
    |
    v
alembic revision --autogenerate
    |
    v Creates file: alembic/versions/xxx_add_field.py
    | Contains: op.add_column('machine', sa.Column('field', ...))
    |
    v
alembic upgrade head
    |
    v Executes SQL: ALTER TABLE machine ADD COLUMN field VARCHAR
    |
    v
Database updated
    |
    v All old records get field = default_value
    |
    v
Server detects change in models.py
    |
    v Restarts (--reload)
    |
    v
Frontend calls GET /machine/schema/create
    |
    v Sees new field
    |
    v
Displays field in form!
```

---

**Remember: Every DB schema change -> run a migration!**
