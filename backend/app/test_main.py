# test_main.py
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from app.main import app
from app.database import get_session
from app.models import Machine


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


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


def test_health(client: TestClient):
    """Test health endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_create_machine(client: TestClient):
    """Test creating a machine"""
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


def test_get_machines(client: TestClient, session: Session):
    """Test getting all machines"""
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


def test_update_machine(client: TestClient, session: Session):
    """Test updating a machine"""
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


def test_get_schema_create(client: TestClient):
    """Test getting create schema"""
    response = client.get("/machine/schema/create")
    assert response.status_code == 200
    schema = response.json()
    assert "properties" in schema
    assert "name" in schema["properties"]

