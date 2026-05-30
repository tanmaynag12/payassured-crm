from dataclasses import dataclass
from datetime import date, datetime
from typing import Optional

@dataclass
class Client:
    name: str
    company: str
    city: Optional[str]
    contact_person: Optional[str]
    phone: Optional[str]
    email: Optional[str]
    id: Optional[int] = None
    created_at: Optional[datetime] = None

@dataclass
class Case:
    client_id: int
    invoice_number: str
    amount: float
    invoice_date: date
    due_date: date
    status: Optional[str] = "New"
    notes: Optional[str] = None
    id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    