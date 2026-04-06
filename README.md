# IntelliTrace: Multi-Tier Supply Chain Fraud Detection

A hackathon-ready SCF fraud platform that stops phantom invoices before they cascade across Tier 1 -> Tier 2 -> Tier 3 financing.

> **Core Philosophy**: *"A phantom invoice is not just a bad document. It is a broken trade event, a broken network relationship, and a broken financing chain."*

## System Architecture

```
┌─────────────────────────────────┐
│         INVOICE UPLOAD           │
│     (Next.js Web Interface)      │
└────────────────┬────────────────┘
                 │
    ┌─────────────▼───────────────┐
    │      FastAPI Backend        │
    │      Orchestration Engine   │
    └──────┬──────┬──────┬────────┘
           │      │      │
    ┌──────▼─┐ ┌──▼──┐ ┌─▼─────┐ ┌──────┐
    │Layer 1 │ │L2   │ │L3     │ │L4/5  │
    │Invoice │ │Phys-│ │Graph  │ │LLM & │
    │DNA     │ │ics  │ │Network│ │PSI   │
    └────────┘ └─────┘ └───────┘ └──────┘
                 │
        ┌────────▼────────┐
        │  DECISION       │
        │ APPROVE/HOLD/   │
        │     BLOCK       │
        └─────────────────┘
```

## What IntelliTrace Covers

The platform now maps directly to the challenge brief:

1. ERP reconciliation against PO / GRN / delivery confirmations
2. Buyer-supplier topology and relationship-gap screening
3. Cross-lender duplicate detection using invoice fingerprints
4. Cash collection monitoring for dilution risk
5. Tier velocity and sequencing anomaly detection
6. Revenue feasibility checks for phantom invoice patterns
7. Graph analytics for carousel trades and shell rings
8. Cross-tier cascade correlation and repeated financing multipliers
9. Pre-disbursement early warning with lender-ready actions

## The 6 Intelligence Layers

| Layer | Name | What It Detects | Technology |
|-------|------|-----------------|------------|
| **1** | Invoice DNA | Duplicate invoices, cross-lender submission | SHA-256, MinHash, Redis |
| **2** | Physics Engine | Impossible delivery times, capacity violations | OSRM routing, capacity DB |
| **3** | Network Graph | Circular fraud rings, shell companies | Neo4j, NetworkX |
| **4** | LLM Explainer | Human-readable fraud explanations | TinyLlama/Phi-2 |
| **5** | PSI Engine | Cross-bank fraud without data sharing | Private Set Intersection |
| **6** | SCF Control Tower | ERP mismatch, dilution, phantom cascades, carousel trades | Rule engine, graph analytics, cascade scoring |

## Quick Start

### 1. Start Infrastructure Services

```bash
cd docker
docker-compose up -d
```

This starts:
- **Neo4j** (Graph DB) on ports 7474 (UI) and 7687 (Bolt)
- **Redis** (Fingerprint registry) on port 6379
- **OSRM** (Routing engine) on port 5000

### 2. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 3. Download LLM Model (Optional)

For AI explanations:

```bash
mkdir -p models/tinyllama
# Download from: https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF
# Save as: models/tinyllama/tinyllama-1.1b-chat.gguf
```

### 4. Start Backend API

```bash
cd backend
uvicorn main:app --reload --port 8000
```

### 5. Test the API

```bash
# Health check
curl http://localhost:8000/health

# Test with the phantom cascade demo (should return BLOCK)
curl -X POST http://localhost:8000/test/phantom-cascade

# Or analyze manually
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "id": "INV-TEST-001",
    "supplier": "Shanghai Steel Co",
    "supplier_id": "shanghai_steel",
    "buyer": "Rotterdam Imports",
    "amount": 4700000,
    "items": ["steel"],
    "origin": "shanghai",
    "destination": "rotterdam",
    "transport_mode": "sea",
    "claimed_days": 2,
    "quantity": 8000,
    "dates": {
      "po_date": "2024-01-10",
      "invoice_date": "2024-01-06",
      "finance_request_date": "2024-01-05"
    }
  }'
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API info |
| `/health` | GET | Service health check |
| `/analyze` | POST | Analyze single invoice |
| `/analyze/batch` | POST | Analyze multiple invoices |
| `/cities` | GET | List supported cities |
| `/suppliers/{id}` | GET | Get supplier network |
| `/test/fraud` | POST | Test with known fraud |
| `/test/phantom-cascade` | POST | Full multi-tier phantom cascade demo |
| `/test/legitimate` | POST | Test with legitimate invoice |

## Response Format

```json
{
  "invoice_id": "INV-TEST-001",
  "decision": "BLOCK",
  "confidence": 0.92,
  "risk_score": 87.5,
  "layers_flagged": ["DNA", "PHYSICS"],
  "layer_scores": {
    "dna": 7,
    "physics": 9,
    "graph": 0
  },
  "results": {
    "dna": { ... },
    "physics": {
      "routing": { ... },
      "capacity": { ... },
      "causality": { ... }
    },
    "graph": { ... }
    "scf": {
      "erp_reconciliation": { ... },
      "dilution_risk": { ... },
      "cascade_correlation": { ... },
      "early_warning": { ... }
    }
  },
  "explanation": "This invoice shows physically impossible delivery times...",
  "processing_time_seconds": 0.234,
  "timestamp": "2024-01-15T10:30:00"
}
```

## Layer Details

### Layer 1: Invoice DNA
- **SHA-256 fingerprinting**: Exact duplicate detection
- **MinHash LSH**: Fuzzy matching for modified invoices
- **Behavioral scoring**: Rapid submission detection
- **Cross-lender PSI**: Multi-bank fraud detection

### Layer 2: Physics Engine
- **Routing validation**: OSRM + haversine distance calculations
- **Transport modes**: Sea (30km/h), Air (800km/h), Road (60km/h), Rail (100km/h)
- **Capacity checking**: Supplier production limits
- **Causality DAG**: Temporal order validation (PO → GRN → Invoice → Payment)

### Layer 3: Network Graph
- **Cycle detection**: DFS algorithm for fraud rings
- **Louvain communities**: Cluster analysis for suspicious groups
- **Centrality metrics**: PageRank, betweenness for hub detection
- **Neo4j integration**: Persistent graph storage

### Layer 4: LLM Explainer
- **TinyLlama/Phi-2**: CPU-only local LLM
- **Rule-based fallback**: Works without LLM
- **Structured prompts**: Consistent explanation format

### Layer 5: PSI Engine
- **Privacy-preserving**: SHA-256 + HMAC hashing
- **Zero data sharing**: Only fingerprint presence revealed
- **Multi-lender alerts**: Detects invoices at 2+ banks

### Layer 6: SCF Control Tower
- **ERP triangulation**: Checks invoice amount, quantity, items, and parties against PO / GRN / delivery feeds
- **Dilution monitoring**: Uses collections, disputes, returns, and credit notes as repayment-quality signals
- **Revenue feasibility**: Compares invoice and financed volume against supplier scale
- **Tier velocity**: Detects suspiciously fast same-day or out-of-order financing hops across tiers
- **Carousel analytics**: Flags trade triangles and concentrated hubs
- **Cascade correlation**: Calculates financing multipliers and downstream exposure before disbursement

## Performance Targets

| Metric | Target | Achieved |
|--------|--------|----------|
| Detection Precision | >90% | Multi-layer validation |
| Alert Time | <3s | Async parallel execution |
| Fraud Ring Detection | 100% | Deterministic DFS |
| PII Data Shared | 0 bytes | Hashed fingerprints only |
| RAM Required | <8GB | CPU-only, no GPU |
| Cost | $0 | 100% open source |

## Environment Variables

```bash
# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password

# OSRM
OSRM_URL=http://localhost:5000

# LLM (optional)
LLM_MODEL_PATH=models/tinyllama/tinyllama-1.1b-chat.gguf
```

## Development

### Project Structure
```
intellitrace/
├── backend/
│   ├── layer1_dna/          # Fingerprinting & registry
│   ├── layer2_physics/      # Routing & capacity
│   ├── layer3_graph/        # Neo4j & cycle detection
│   ├── layer4_llm/          # Explanation generator
│   ├── layer5_psi/          # Cross-lender detection
│   ├── layer6_scf/          # ERP, dilution, and cascade intelligence
│   ├── models/              # Pydantic models
│   ├── main.py              # FastAPI app
│   └── orchestrator.py      # Layer orchestration
├── docker/
│   └── docker-compose.yml   # Infrastructure services
├── requirements.txt
└── README.md
```

### Running Tests

```bash
# Test phantom cascade demo
curl http://localhost:8000/test/phantom-cascade

# Test fraud detection
curl http://localhost:8000/test/fraud

# Test legitimate invoice
curl http://localhost:8000/test/legitimate
```

## License

MIT License - Open source for fraud prevention.

## Contributing

Contributions welcome! Areas of interest:
- Additional city coordinates for routing
- Industry-specific capacity databases
- GNN fraud scoring models
- Multi-language LLM explanations
