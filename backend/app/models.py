# models.py
from typing import Optional
from datetime import datetime, timezone
from enum import Enum
from sqlmodel import Field, SQLModel
from pydantic import EmailStr


class MachineStatus(str, Enum):
    """Machine status enum"""
    active = "active"
    not_active = "not_active"


# Base model with common fields
class MachineBase(SQLModel):
    name: str = Field(max_length=10)
    location: str
    email: EmailStr
    number: int
    float_number: float
    enum: MachineStatus = Field(default=MachineStatus.active)
    family_name: Optional[str] = Field(default="", max_length=20)
    age: Optional[int] = Field(default=0, ge=0, le=100)


# Database model (table=True)
class Machine(MachineBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    password: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    edited_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# Create model - for POST requests
class MachineCreate(MachineBase):
    password: str


# Update model - for PUT requests
class MachineUpdate(MachineBase):
    password: str


# Read model - for responses (no password)
class MachineRead(MachineBase):
    id: int
    created_at: datetime
    edited_at: datetime
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

