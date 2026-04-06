"""Pydantic data models for Invoice Physics API."""
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime
from enum import Enum


class Decision(str, Enum):
    APPROVE = "APPROVE"
    HOLD = "HOLD"
    BLOCK = "BLOCK"


class TransportMode(str, Enum):
    SEA = "sea"
    AIR = "air"
    ROAD = "road"
    RAIL = "rail"


class InvoiceDates(BaseModel):
    po_date: Optional[str] = None
    grn_date: Optional[str] = None
    invoice_date: Optional[str] = None
    finance_request_date: Optional[str] = None
    delivery_date: Optional[str] = None
    payment_date: Optional[str] = None
    buyer_payment_date: Optional[str] = None


class Invoice(BaseModel):
    id: str = Field(..., description="Unique invoice identifier")
    supplier: str = Field(..., description="Supplier company name")
    supplier_id: str = Field(..., description="Supplier unique ID")
    buyer: str = Field(..., description="Buyer company name")
    buyer_id: Optional[str] = Field(None, description="Buyer unique ID")
    amount: float = Field(..., gt=0, description="Invoice amount in USD")
    items: List[str] = Field(default_factory=list, description="List of items")
    origin: str = Field(..., description="Origin city")
    destination: str = Field(..., description="Destination city")
    transport_mode: TransportMode = Field(..., description="Transportation mode")
    claimed_days: float = Field(..., gt=0, description="Claimed delivery days")
    quantity: float = Field(..., ge=0, description="Quantity in tons")
    dates: InvoiceDates = Field(..., description="Timeline dates")
    lender_id: Optional[str] = Field(default="bank_main", description="Lender querying the invoice")
    po_text: Optional[str] = Field(None, description="Purchase Order text for semantic match")
    grn_text: Optional[str] = Field(None, description="Goods Receipt Note text for semantic match")
    bol_text: Optional[str] = Field(None, description="Bill of Lading text for semantic match")
    invoice_text: Optional[str] = Field(None, description="Invoice document text for semantic match")
    obligation_edges: Optional[List[tuple]] = Field(default_factory=list, description="Graph edges for cycle detection")


class DNAResult(BaseModel):
    status: str
    original_id: Optional[str] = None
    similar_ids: Optional[List[str]] = None
    invoice_id: Optional[str] = None
    submissions_last_hour: int
    anomaly_score: float
    flagged: bool
    psi: Dict[str, Any]


class PhysicsResult(BaseModel):
    routing: Dict[str, Any]
    capacity: Dict[str, Any]
    causality: Dict[str, Any]


class GraphResult(BaseModel):
    cycles_found: int
    fraud_rings: List[List[str]]
    flagged: bool
    verdict: str


class AnalysisResult(BaseModel):
    invoice_id: str
    decision: Decision
    layers_flagged: List[str]
    results: Dict[str, Any]
    explanation: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
