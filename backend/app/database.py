# database.py
from sqlmodel import SQLModel, create_engine, Session

# SQLite database URL
DATABASE_URL = "sqlite:///./machines.db"

# Create engine
engine = create_engine(DATABASE_URL, echo=True, connect_args={"check_same_thread": False})


def create_db_and_tables():
    """Create all tables in the database"""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Dependency to get database session"""
    with Session(engine) as session:
        yield session

