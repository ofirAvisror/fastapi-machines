# main.py
from typing import List, Optional
from datetime import datetime, timezone
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from app.database import create_db_and_tables, get_session
from app.models import Machine, MachineCreate, MachineUpdate, MachineRead


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler - create database tables on startup"""
    create_db_and_tables()
    yield


app = FastAPI(title="Smart Forms API", version="1.0.0", lifespan=lifespan)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    """Health check endpoint"""
    return {"status": "ok"}


@app.post("/machine/create", response_model=MachineRead, status_code=201)
def create_machine(payload: MachineCreate, session: Session = Depends(get_session)):
    """Create a new machine"""
    now = datetime.now(timezone.utc)
    machine = Machine(
        **payload.model_dump(),
        created_at=now,
        edited_at=now
    )
    session.add(machine)
    session.commit()
    session.refresh(machine)
    return machine


@app.get("/machine/get", response_model=List[MachineRead])
def get_machines(
    machine_id: Optional[int] = Query(None, description="Filter by machine ID", alias="id"),
    email: Optional[str] = Query(None, description="Filter by email"),
    session: Session = Depends(get_session)
):
    """Get machines with optional filters, ordered by name and email"""
    statement = select(Machine)
    
    if machine_id is not None:
        statement = statement.where(Machine.id == machine_id)
    if email is not None:
        statement = statement.where(Machine.email == email)
    
    # Order by name, then by email
    statement = statement.order_by( Machine.email, Machine.enum,Machine.location, Machine.name)
    
    machines = session.exec(statement).all()
    return machines

@app.put("/machine/update", response_model=MachineRead)
def update_machine(
    payload: MachineUpdate,
    machine_id: int = Query(..., description="The ID of the machine to update"),
    session: Session = Depends(get_session)
):
    """Update an existing machine"""
    machine = session.get(Machine, machine_id)
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    
    # Get only the fields that were actually set in the request
    update_data = payload.model_dump(exclude_unset=True)
    
    # Update fields, but handle password specially
    for key, value in update_data.items():
        if key == 'password':
            # Only update password if it's provided and not empty
            if value and value.strip():
                setattr(machine, key, value)
        else:
            setattr(machine, key, value)
    
    machine.edited_at = datetime.now(timezone.utc)
    
    session.add(machine)
    session.commit()
    session.refresh(machine)
    return machine


@app.get("/machine/schema/{method}")
def get_machine_schema(method: str):
    """Get JSON schema for create or update methods"""
    if method == "create":
        return MachineCreate.model_json_schema()
    elif method == "update":
        return MachineUpdate.model_json_schema()
    else:
        raise HTTPException(
            status_code=400, 
            detail="Invalid method. Use 'create' or 'update'"
        )
