# Quick Start - Adding a New Field to Database

## 3 Simple Steps:

### 1. Edit models.py

```python
# backend/app/models.py
class MachineBase(SQLModel):
    name: str
    location: str
    phone: Optional[str] = Field(default="")  # New field!
```

### 2. Run Migration

```bash
# In terminal at: C:\Streampay\backend
migrate.bat "Add phone field"
```

Or manually:

```bash
.\venv\Scripts\alembic.exe revision --autogenerate -m "Add phone"
.\venv\Scripts\alembic.exe upgrade head
```

### 3. Done!

- Database updated automatically
- Server restarts (if --reload is active)
- Frontend sees the new field

---

## Important:

- Alembic preserves all existing data
- Only adds the new column
- Old records get the default value

## Example:

```
Before: | id | name | location |
After:  | id | name | location | phone |
         ^ Old data preserved!  ^ default value
```

---

## Useful Commands:

```bash
alembic current      # Show current version
alembic history      # Show migration history
alembic downgrade -1 # Rollback one migration
```

Full guide: See `MIGRATIONS.md`
