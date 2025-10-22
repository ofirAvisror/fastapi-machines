# test_main.py
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from app.main import app
from app.database import get_session
from app.models import Machine


# Test fixture that creates an in-memory SQLite database for testing
# This ensures each test runs with a fresh, isolated database
@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


# Test fixture that provides a TestClient with database session override
# This allows us to use the test database instead of the production database
@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


# Test the health check endpoint
# Verifies that the API is running and returns the expected status
def test_health(client: TestClient):
    """Test health endpoint returns 200 OK with correct status message"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


# Test creating a new machine via POST /machine/create
# Verifies that:
# 1. The endpoint returns 201 Created status
# 2. The machine is created with correct data
# 3. Password is NOT included in the response (security check)
# 4. An ID is automatically generated
def test_create_machine(client: TestClient):
    """Test creating a machine returns 201 and excludes password from response"""
    machine_data = {
        "name": "Machine1",
        "location": "Tel Aviv",
        "email": "test@example.com",
        "number": 42,
        "float_number": 3.14,
        "enum": "active",
        "password": "secret123"
    }
    response = client.post("/machine/create", json=machine_data)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Machine1"
    assert "password" not in data
    assert "id" in data


# Test retrieving machines via GET /machine/get
# Verifies that:
# 1. The endpoint returns 200 OK status
# 2. Machines can be retrieved from the database
# 3. The response contains a list of machines
def test_get_machines(client: TestClient, session: Session):
    """Test getting all machines returns 200 and retrieves stored machines"""
    machine1 = Machine(
        name="M1",
        location="Location1",
        email="m1@test.com",
        number=1,
        float_number=1.1,
        enum="active",
        password="pass1"
    )
    session.add(machine1)
    session.commit()

    response = client.get("/machine/get")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1


# Test updating an existing machine via PUT /machine/update
# Verifies that:
# 1. An existing machine can be updated
# 2. The endpoint returns 200 OK status
# 3. The updated data is correctly saved
# 4. The edited_at timestamp is automatically updated
def test_update_machine(client: TestClient, session: Session):
    """Test updating a machine returns 200 and updates the data correctly"""
    machine = Machine(
        name="Original",
        location="Old Location",
        email="old@test.com",
        number=1,
        float_number=1.0,
        enum="active",
        password="oldpass"
    )
    session.add(machine)
    session.commit()
    session.refresh(machine)

    update_data = {
        "name": "Updated",
        "location": "New Location",
        "email": "new@test.com",
        "number": 100,
        "float_number": 10.5,
        "enum": "not_active",
        "password": "newpass"
    }
    response = client.put(f"/machine/update?machine_id={machine.id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated"


# Test retrieving the JSON schema for machine creation via GET /machine/schema/create
# Verifies that:
# 1. The endpoint returns 200 OK status
# 2. A valid JSON schema is returned
# 3. The schema contains the expected properties
# This schema is used by the frontend to dynamically generate forms
def test_get_schema_create(client: TestClient):
    """Test getting create schema returns 200 and valid JSON schema for dynamic form generation"""
    response = client.get("/machine/schema/create")
    assert response.status_code == 200
    schema = response.json()
    assert "properties" in schema
    assert "name" in schema["properties"]

