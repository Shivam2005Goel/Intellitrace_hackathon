"""FastAPI backend for Invoice Physics - Fraud Detection API."""
from fastapi import FastAPI, HTTPException, BackgroundTasks, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
import uvicorn

from orchestrator import analyze_invoice_async, analyze_invoice
from models.invoice import Invoice, AnalysisResult, Decision
from demo_scenarios import get_phantom_cascade_invoice, get_legitimate_baseline_invoice

app = FastAPI(
    title="IntelliTrace SCF Fraud API",
    description="Multi-tier supply-chain finance fraud detection with ERP, graph, and cascade intelligence",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class InvoiceRequest(BaseModel):
    """Request model for invoice analysis."""
    id: str = Field(..., description="Unique invoice identifier")
    supplier: str
    supplier_id: str
    buyer: str
    buyer_id: Optional[str] = None
    amount: float = Field(..., gt=0)
    items: List[str] = Field(default_factory=list)
    origin: str
    destination: str
    transport_mode: str = Field(default="sea")
    claimed_days: float = Field(..., gt=0)
    quantity: float = Field(..., ge=0)
    dates: Dict[str, Optional[str]] = Field(default_factory=dict)
    lender_id: Optional[str] = Field(default="bank_main")
    po_text: Optional[str] = None
    grn_text: Optional[str] = None
    bol_text: Optional[str] = None
    invoice_text: Optional[str] = None
    obligation_edges: Optional[List[tuple]] = Field(default_factory=list)
    industry: Optional[str] = None
    tier_level: Optional[int] = Field(default=1, ge=1, le=5)
    erp_records: Optional[Dict[str, Any]] = Field(default_factory=dict)
    related_invoices: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    cash_flow: Optional[Dict[str, Any]] = Field(default_factory=dict)
    supplier_profile: Optional[Dict[str, Any]] = Field(default_factory=dict)


class BatchAnalysisRequest(BaseModel):
    """Request model for batch analysis."""
    invoices: List[InvoiceRequest]


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    version: str
    timestamp: datetime
    services: Dict[str, bool]


@app.get("/", tags=["General"])
async def root():
    """Root endpoint with API info."""
    return {
        "name": "IntelliTrace SCF Fraud API",
        "version": "2.0.0",
        "description": "Fraud detection through physical reality, multi-tier correlation, and SCF control-tower analytics",
        "endpoints": {
            "docs": "/docs",
            "analyze": "POST /analyze",
            "health": "GET /health",
            "phantom_demo": "POST /test/phantom-cascade"
        }
    }


@app.get("/health", response_model=HealthResponse, tags=["General"])
async def health():
    """Health check endpoint."""
    # Check service availability
    services = {
        "api": True,
        "neo4j": False,
        "redis": False
    }
    
    # Try Neo4j
    try:
        from layer3_graph.graph_builder import get_graph_builder
        gb = get_graph_builder()
        services["neo4j"] = gb.is_connected()
    except Exception:
        pass
    
    # Try Redis
    try:
        import redis
        r = redis.Redis(host='localhost', port=6379, socket_connect_timeout=1)
        r.ping()
        services["redis"] = True
    except Exception:
        pass
    
    return HealthResponse(
        status="healthy" if services["api"] else "degraded",
        version="2.0.0",
        timestamp=datetime.utcnow(),
        services=services
    )


@app.post("/analyze", response_model=Dict[str, Any], tags=["Analysis"])
async def analyze(invoice: InvoiceRequest):
    """
    Analyze a single invoice through all 5 layers.
    
    Returns fraud detection results including:
    - Decision: APPROVE / HOLD / BLOCK
    - Risk score: 0-100%
    - Layer-by-layer analysis
    - AI-generated explanation
    """
    try:
        # Convert to dict and run analysis
        invoice_dict = invoice.dict()
        result = await analyze_invoice_async(invoice_dict)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.post("/analyze/upload", tags=["Ingestion"])
async def upload_invoice(file: UploadFile = File(...)):
    """
    Ingest a PDF or Image invoice, extract its text, and map to an InvoiceRequest structure.
    Used by the frontend to pre-fill the submission form.
    """
    try:
        from layer0_ingestion.extractor import extract_invoice_data
        content = await file.read()
        extracted_data = extract_invoice_data(content, file.filename)
        return {"extracted": extracted_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")


@app.post("/analyze/batch", tags=["Analysis"])
async def analyze_batch(request: BatchAnalysisRequest):
    """
    Analyze multiple invoices in batch.
    """
    results = []
    errors = []
    
    for i, invoice in enumerate(request.invoices):
        try:
            result = await analyze_invoice_async(invoice.dict())
            results.append(result)
        except Exception as e:
            errors.append({
                "index": i,
                "invoice_id": invoice.id,
                "error": str(e)
            })
    
    return {
        "total": len(request.invoices),
        "successful": len(results),
        "failed": len(errors),
        "results": results,
        "errors": errors
    }


@app.get("/cities", tags=["Reference"])
async def get_cities():
    """Get list of supported cities for routing."""
    from layer2_physics.routing import CITY_COORDS
    return {
        "cities": sorted(CITY_COORDS.keys()),
        "count": len(CITY_COORDS)
    }


@app.get("/suppliers/{supplier_id}", tags=["Reference"])
async def get_supplier_info(supplier_id: str):
    """Get supplier network information."""
    try:
        from layer3_graph.graph_builder import get_graph_builder
        gb = get_graph_builder()
        
        if not gb.is_connected():
            return {"error": "Graph database not available"}
        
        network = gb.get_company_network(supplier_id)
        return network
    except Exception as e:
        return {"error": str(e)}


@app.post("/test/fraud", tags=["Testing"])
async def test_fraud_detection():
    """
    Test endpoint with a known fraudulent invoice.
    Returns expected BLOCK decision.
    """
    test_invoice = {
        **get_phantom_cascade_invoice()
    }
    
    result = await analyze_invoice_async(test_invoice)
    return {
        "test_invoice": test_invoice,
        "analysis_result": result,
        "expected_decision": "BLOCK",
        "test_passed": result["decision"] == "BLOCK"
    }


@app.post("/test/legitimate", tags=["Testing"])
async def test_legitimate_detection():
    """
    Test endpoint with a legitimate invoice.
    Returns expected APPROVE decision.
    """
    test_invoice = {**get_legitimate_baseline_invoice()}
    
    result = await analyze_invoice_async(test_invoice)
    return {
        "test_invoice": test_invoice,
        "analysis_result": result,
        "expected_decision": "APPROVE",
        "test_passed": result["decision"] == "APPROVE"
    }


@app.post("/test/phantom-cascade", tags=["Testing"])
async def test_phantom_cascade():
    """
    End-to-end demo for the hackathon brief:
    Tier-1 phantom invoice amplified by Tier-2 and Tier-3 financing.
    """
    test_invoice = get_phantom_cascade_invoice()
    result = await analyze_invoice_async(test_invoice)
    return {
        "scenario": "phantom-cascade",
        "test_invoice": test_invoice,
        "analysis_result": result,
        "expected_decision": "BLOCK",
        "test_passed": result["decision"] == "BLOCK"
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
