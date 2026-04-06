<p align="center">
  <img src="https://img.shields.io/badge/DECISION-BLOCK-FF6B6B?style=for-the-badge&labelColor=0a0a0f&logo=shieldsdotio&logoColor=FF6B6B" alt="block" />
  <img src="https://img.shields.io/badge/RISK_SCORE-94.7%25-FF6B6B?style=for-the-badge&labelColor=0a0a0f" alt="risk" />
  <img src="https://img.shields.io/badge/LAYERS_FLAGGED-5%2F6-FFB35C?style=for-the-badge&labelColor=0a0a0f" alt="layers" />
  <img src="https://img.shields.io/badge/PROCESSING-0.38s-2DD4BF?style=for-the-badge&labelColor=0a0a0f" alt="speed" />
</p>

<h1 align="center">
  🛡️ IntelliTrace
</h1>

<h3 align="center">
  <em>Real-Time Multi-Tier Supply-Chain Finance Fraud Detection & Intelligence Platform</em>
</h3>

<p align="center">
  <strong>When a single phantom invoice cascades through 3 tiers and 4 lenders, turning $138K into $47M of fraudulent exposure — traditional checks see nothing. IntelliTrace sees everything.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-FastAPI-009688?style=flat-square&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Neo4j-Graph_DB-4581C3?style=flat-square&logo=neo4j" alt="Neo4j" />
  <img src="https://img.shields.io/badge/Redis-Fingerprint_Store-DC382D?style=flat-square&logo=redis" alt="Redis" />
  <img src="https://img.shields.io/badge/Gemini-LLM_Engine-4285F4?style=flat-square&logo=google" alt="Gemini" />
  <img src="https://img.shields.io/badge/Framer_Motion-Animations-0055FF?style=flat-square&logo=framer" alt="Framer" />
</p>

---

## 📌 The Problem That Costs Banks Billions

> *"In multi-tier supply chain finance, a Tier-1 supplier fabricated **340 phantom invoices (~$47M)**. Each invoice looked legitimate individually, but cross-tier cascading triggered repeated financing, multiplying exposure. **Traditional invoice checks failed** because the fraud becomes visible only through network-level correlation."*

### Why Current Solutions Fail

| Traditional Check | What It Catches | What It **Misses** |
|---|---|---|
| Invoice Amount Validation | Obvious over-billing | Amounts that match POs but represent phantom goods |
| Duplicate Detection (hash) | Exact copies | Slightly modified invoices with identical economic substance |
| KYC / Onboarding | Unknown entities | Shell companies with legitimate registrations |
| Single-Lender Review | Internal duplicates | The **same** invoice financed at 4 different banks |
| Manual Audit | Known patterns | Carousel structures visible only in graph topology |

**The core problem is dimensional:** Invoice fraud in multi-tier SCF is not a single-point failure — it is a **network phenomenon** that requires network-level intelligence.

---

## 💡 Our Solution: 6-Layer Deep Fraud Intelligence

IntelliTrace introduces a **physics-inspired, graph-native, AI-augmented** fraud detection architecture that simultaneously validates invoices across six orthogonal analytical dimensions. No single layer can be fooled when all six must agree.

```
┌─────────────────────────────────────────────────────────────────────┐
│                     INVOICE SUBMISSION                              │
│              (PDF Upload / Manual Entry / ERP Feed)                 │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
            ┌──────────────▼──────────────┐
            │    LAYER 0: INGESTION       │  OCR / PDF extraction
            │    Gemini Vision + Parser   │  → Structured invoice data
            └──────────────┬──────────────┘
                           │
     ┌─────────────────────┼─────────────────────┐
     │                     │                     │
     ▼                     ▼                     ▼
┌─────────┐         ┌───────────┐         ┌───────────┐
│ LAYER 1 │         │  LAYER 2  │         │  LAYER 3  │
│   DNA   │         │  PHYSICS  │         │   GRAPH   │
│         │         │           │         │           │
│• SHA-256│         │• Geo-     │         │• Neo4j    │
│  finger-│         │  routing  │         │  topology │
│  print  │         │  feasib-  │         │• Cycle    │
│• MinHash│         │  ility    │         │  detection│
│  near-  │         │• Capacity │         │• Community│
│  dup    │         │  physics  │         │  analysis │
│• Behav- │         │• Temporal │         │• Tier-    │
│  ioral  │         │  causality│         │  shifting │
│  scoring│         │• Market   │         │• Shadow   │
│• Trust  │         │  physics  │         │  tier     │
│  decay  │         │           │         │• Cash     │
│• Reson- │         │           │         │  rebound  │
│  ance   │         │           │         │           │
└────┬────┘         └─────┬─────┘         └─────┬─────┘
     │                    │                     │
     └────────────┬───────┴───────┬─────────────┘
                  │               │
                  ▼               ▼
          ┌──────────────┐ ┌───────────┐
          │   LAYER 5    │ │  LAYER 6  │
          │     PSI      │ │    SCF    │
          │              │ │ INTELLI-  │
          │• Cross-lender│ │ GENCE     │
          │  fingerprint │ │           │
          │  matching    │ │• ERP      │
          │• HMAC-secure │ │  reconcil.│
          │  privacy-    │ │• Dilution │
          │  preserving  │ │  monitor  │
          │  set inter-  │ │• Revenue  │
          │  section     │ │  feasib.  │
          │• Multi-bank  │ │• Velocity │
          │  consortium  │ │  anomaly  │
          │              │ │• Carousel │
          │              │ │  trade    │
          │              │ │• Cascade  │
          │              │ │  correlat.│
          │              │ │• Pre-dis- │
          │              │ │  bursement│
          │              │ │  warning  │
          └──────┬───────┘ └─────┬─────┘
                 │               │
                 └───────┬───────┘
                         ▼
               ┌──────────────────┐
               │    LAYER 4       │
               │  LLM EXPLAINER   │
               │                  │
               │ • Gemini Pro     │
               │ • Semantic       │
               │   consistency    │
               │ • Human-readable │
               │   risk narrative │
               └────────┬─────────┘
                        │
                        ▼
              ┌───────────────────┐
              │  DECISION ENGINE  │
              │  ────────────────│
              │  APPROVE │ HOLD  │
              │       BLOCK      │
              │                  │
              │ + Fraud Persona  │
              │   Classification │
              └──────────────────┘
```

---

## 🔬 Layer-by-Layer Deep Dive

### Layer 1: Invoice DNA — *"Every invoice has a genetic fingerprint"*

| Capability | How It Works | What It Catches |
|---|---|---|
| **SHA-256 Fingerprinting** | Deterministic hash of normalized invoice fields | Exact duplicate submissions across time |
| **MinHash Near-Duplicate** | Locality-sensitive hashing with Jaccard similarity | Invoices modified slightly to evade exact-match filters |
| **Behavioral Scoring** | Submission velocity, timing patterns, burst detection | Bot-like submission cadence, off-hours mass uploads |
| **Trust Decay** | Rolling supplier trust score that degrades on anomalies | Suppliers gradually testing boundaries before large fraud |
| **Resonance Detection** | Periodic patterns in submission intervals | Automated carousel submissions with fixed timing |

### Layer 2: Physics Validation — *"Can this invoice exist in physical reality?"*

| Check | Logic | Red Flag |
|---|---|---|
| **Geo-Routing Feasibility** | Haversine distance ÷ transport speed vs. claimed transit days | Shanghai→Rotterdam in 2 days by sea (impossible) |
| **Supplier Capacity** | Invoice quantity vs. known production capacity + industry benchmarks | 8,000 tons from a facility rated for 2,000 |
| **Temporal Causality (DAG)** | PO → Invoice → GRN → Delivery must be chronologically ordered | Invoice dated before the purchase order |
| **Market Physics** | Unit price vs. commodity benchmarks, FX rate reasonableness | Steel priced 3× above LME reference |

### Layer 3: Network Graph Intelligence — *"Fraud hides in the topology"*

Built on **Neo4j** for persistent graph storage and real-time traversal:

- **Cycle Detection** — Finds circular obligation flows (A→B→C→A) that indicate carousel fraud
- **Community Analysis** — Identifies tightly-coupled entity clusters that transact exclusively with each other
- **Tier-Shifting** — Detects suppliers appearing at multiple tier levels simultaneously
- **Shadow Tier** — Exposes intermediaries with no production capacity acting as pass-through entities
- **Cash Rebound** — Tracks money flowing back to the originator through indirect paths

### Layer 4: LLM Explainer — *"AI that speaks the analyst's language"*

Powered by **Google Gemini**, this layer:
- Generates **human-readable risk narratives** from raw numerical signals
- Performs **semantic consistency checks** between invoice text, PO descriptions, and delivery notes
- Produces **executive-ready decision summaries** for compliance teams
- Explains *why* the system flagged something, not just *that* it flagged it

### Layer 5: PSI — Privacy-Preserving Cross-Lender Intelligence

> **The breakthrough:** Detect the same invoice financing across multiple banks **without sharing raw invoice data.**

- Uses **HMAC-secured fingerprint hashing** — banks submit hashed fingerprints, never raw data
- **Redis-backed** real-time matching with 90-day TTL
- Identifies invoices submitted to 2, 3, or 4+ lenders simultaneously
- Consortium-level analytics without breaking banking confidentiality
- In-memory fallback when Redis is unavailable — **zero downtime**

### Layer 6: SCF Control Tower — *"7 sub-engines purpose-built for supply-chain finance"*

This is the **industry-specific intelligence layer** that no general-purpose fraud system provides:

| Sub-Engine | Function | Key Metric |
|---|---|---|
| **ERP Reconciliation** | Cross-validates invoice against PO, GRN, and delivery feeds | `match_quality` (0→1) |
| **Relationship Gap** | Flags buyer-supplier pairs missing from the known topology | `supplier_degree`, `buyer_degree` |
| **Dilution Monitor** | Tracks cash collections vs. financed amounts | `dilution_ratio`, `collection_gap` |
| **Revenue Feasibility** | Validates invoice against supplier's known revenue capacity | `phantom_probability` |
| **Tier Velocity** | Detects rapid-fire cross-tier financing bursts | `rapid_hops`, `same_day_hops` |
| **Carousel Trade** | Graph-based circular structure detection with centrality analysis | `triangle_count`, `top_hubs` |
| **Cascade Correlation** | Maps total financing exposure across the full invoice chain | `financing_multiplier` |

Each sub-engine feeds into a **Pre-Disbursement Early Warning** system that produces a final `APPROVE` / `HOLD` / `BLOCK` recommendation with urgency level and estimated exposure at risk.

---

## 🎯 Fraud Persona Classifier

IntelliTrace doesn't just detect fraud — it **classifies the type of fraud** using a multi-dimensional persona engine:

```
┌────────────────────────┬──────────────────────────────────────────────────┐
│ Persona                │ Signal Sources                                   │
├────────────────────────┼──────────────────────────────────────────────────┤
│ 🔄 Tier Hopping        │ Graph: tier_shifting_score                      │
│ 💰 Cash Rebound        │ Graph: cash_rebound_score                       │
│ 👻 Shadow Tier         │ Graph: shadow_tier_score                        │
│ ⏪ Gap Phantom          │ Physics: causality paradox_score                │
│ 🎵 Temporal Rhythm     │ DNA: resonance_score                            │
│ 🌊 Phantom Cascade     │ SCF: cascade_correlation score                  │
│ 📉 Dilution Fraud      │ SCF: dilution_risk score                        │
│ 💳 Double Financing    │ SCF: tier_velocity score                        │
│ 🔗 Relationship Gap    │ SCF: relationship_gap score                     │
│ 🎠 Carousel Trade      │ SCF: carousel_risk score                        │
└────────────────────────┴──────────────────────────────────────────────────┘
```

---

## 🖥️ Analyst Workbench (Frontend)

A **dark-mode, data-dense command center** built for fraud analysts, compliance officers, and risk managers.

### Core Dashboard Modules

| Component | Purpose |
|---|---|
| **Invoice Submission Form** | 30+ fields including ERP records, cascade chain builder, cash flow inputs, and file-assisted OCR parsing |
| **Decision Banner** | Real-time APPROVE/HOLD/BLOCK with animated DecryptedText reveal, risk score, confidence, escalated layers |
| **Executive Brief Panel** | One-page summary for C-suite — verdict, top signals, recommended actions |
| **Results Panel** | 5-tab deep-dive: Signal Digest → DNA → Physics → Graph → SCF Intelligence |
| **AI Copilot** | Conversational assistant with suggested prompts for demo scenarios (Phantom Cascade, Dilution, Carousel) |
| **Live Telemetry Ticker** | Real-time scrolling feed of system-level fraud telemetry |
| **Scenario Launcher** | One-click demo scenarios with pre-loaded fraudulent and legitimate invoices |

### Visualization Suite (7 Interactive Chart Types)

| Chart | Library | Use Case |
|---|---|---|
| **Risk Radar** | Recharts | Spider-web overlay of all 6 layer scores |
| **Layer Bar Chart** | Recharts | Comparative bar chart of layer-by-layer risk |
| **Decision Pie** | Recharts | APPROVE/HOLD/BLOCK distribution over time |
| **Trend Line** | Recharts | Historical risk score trends |
| **Risk Gauge** | Custom SVG | Animated radial gauge for overall risk |
| **Network Graph** | D3.js Force | Interactive buyer-supplier topology with fraud ring highlighting |
| **Sankey Flow** | Recharts | Financial flow visualization across supply chain tiers |

### Advanced Dashboard Panels

| Panel | Function |
|---|---|
| **World Threat Map** | Geographic heatmap of flagged invoice origins |
| **Velocity Anomalies** | Real-time stream of tier-velocity alerts |
| **Pre-Disbursement Engine** | Lender-facing early warning dashboard |
| **Document Reconciliation** | Side-by-side PO↔Invoice↔GRN comparison |
| **Invoice Timeline** | Chronological DAG of invoice lifecycle events |
| **Metrics Overview** | KPI tiles: invoices processed, blocked rate, avg risk, exposure |

### UI/UX Design System

- **Glassmorphism cards** with `backdrop-filter: blur(12px)` surfaces
- **Framer Motion** page transitions, staggered list animations, and micro-interactions
- **DecryptedText** cipher-reveal effect on key UI elements for a cybersecurity aesthetic
- **CSS Variable theming** (`--accent-cyan`, `--accent-red`, `--surface-muted`) for consistent dark-mode design
- **Responsive grid layouts** optimized for 4K analyst workstations and tablet displays

---

## 🏗️ Technical Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                             │
│                                                                      │
│  Next.js 15 (App Router) + Framer Motion + Recharts + D3.js         │
│  Port: 3002                                                          │
└───────────────────────────────┬──────────────────────────────────────┘
                                │ REST API
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      BACKEND (FastAPI)                                │
│                      Port: 8000                                      │
│                                                                      │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────┐     │
│  │   main.py   │  │ orchestrator │  │   demo_scenarios.py     │     │
│  │  (Router)   │─▶│   .py        │  │  (Phantom, Legitimate)  │     │
│  └─────────────┘  └──────┬───────┘  └─────────────────────────┘     │
│                          │                                           │
│  ┌───────┬───────┬───────┼───────┬──────────┬──────────┐            │
│  │ L1    │ L2    │ L3    │ L4    │ L5       │ L6       │            │
│  │ DNA   │ Phys  │ Graph │ LLM   │ PSI      │ SCF      │            │
│  │       │       │       │       │          │ Intel    │            │
│  └───┬───┴───┬───┴───┬───┴───┬───┴────┬─────┴────┬─────┘            │
│      │       │       │       │        │          │                   │
│      ▼       │       ▼       ▼        ▼          │                   │
│  ┌───────┐   │  ┌────────┐ ┌──────┐ ┌──────┐    │                   │
│  │ Redis │   │  │ Neo4j  │ │Gemini│ │Redis │    │                   │
│  │(L1 FP)│   │  │(Graph) │ │ API  │ │(PSI) │    │                   │
│  └───────┘   │  └────────┘ └──────┘ └──────┘    │                   │
│              │                                   │                   │
│         Haversine                          ┌─────┴─────┐             │
│         Distance                          │ 7 Sub-    │             │
│         Engine                            │ Engines   │             │
│                                           └───────────┘             │
│                                                                      │
│  ┌────────────────────┐                                              │
│  │   classifier.py    │  Fraud Persona Classification                │
│  │  (10 fraud types)  │                                              │
│  └────────────────────┘                                              │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| Python | 3.10+ | Backend runtime |
| Node.js | 18+ | Frontend runtime |
| Docker | Latest | Neo4j + Redis containers |
| Google Gemini API Key | — | LLM explainability layer |

### 1. Clone & Install

```bash
git clone https://github.com/Shivam2005Goel/Intellitrace_hackathon.git
cd Intellitrace_hackathon
```

### 2. Backend Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate   # macOS/Linux
# venv\Scripts\activate    # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp backend/.env.example backend/.env
# Edit .env with your Gemini API key, Redis, and Neo4j credentials
```

### 3. Infrastructure (Docker)

```bash
# Start Neo4j and Redis
docker compose -f docker/docker-compose.yml up -d

# Verify
docker ps  # Should show neo4j and redis containers
```

### 4. Start Backend

```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 5. Start Frontend

```bash
cd frontend-next
npm install
npx next dev -p 3002
```

### 6. Open Dashboard

Navigate to **http://localhost:3002** — the Analyst Workbench is live.

---

## 🧪 Demo Scenarios

IntelliTrace ships with ready-to-run fraud scenarios for demonstrations:

### Phantom Cascade Attack

```bash
curl -X POST http://localhost:8000/test/phantom-cascade
```

**What happens:** A Tier-1 supplier submits a $4.7M invoice for 8,000 tons of steel, claiming Shanghai→Rotterdam delivery in 2 days by sea. The invoice chains through Tier-2 and Tier-3 financing.

**IntelliTrace detects:**
- ❌ **Physics:** Sea freight Shanghai→Rotterdam requires ~30 days, not 2
- ❌ **DNA:** Behavioral velocity anomaly from supplier
- ❌ **Graph:** Tier-shifting detected — supplier appears at multiple tier levels
- ❌ **SCF:** Cascade correlation shows 2.3× financing multiplier
- ❌ **PSI:** Same fingerprint submitted to multiple lenders
- 🚨 **Decision: BLOCK** (Risk Score: 94.7%)

### Legitimate Baseline

```bash
curl -X POST http://localhost:8000/test/legitimate
```

**What happens:** A standard invoice with proper PO/GRN alignment, reasonable transit times, and established supplier history.

**IntelliTrace responds:**
- ✅ All 6 layers pass
- ✅ **Decision: APPROVE** (Risk Score: 2.1%)

---

## 📊 API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/health` | GET | System health + Neo4j/Redis status |
| `/analyze` | POST | Analyze single invoice through all 6 layers |
| `/analyze/upload` | POST | Upload PDF/image invoice for OCR extraction |
| `/analyze/batch` | POST | Batch analyze multiple invoices |
| `/cities` | GET | Supported cities for routing validation |
| `/suppliers/{id}` | GET | Supplier network topology from Neo4j |
| `/test/fraud` | POST | Run pre-loaded fraud scenario |
| `/test/legitimate` | POST | Run pre-loaded legitimate scenario |
| `/test/phantom-cascade` | POST | Full phantom cascade demo |
| `/docs` | GET | Interactive Swagger documentation |

---

## 📐 Design Decisions & Trade-offs

| Decision | Rationale |
|---|---|
| **6 independent layers** vs. single ML model | Explainability — each layer's contribution to the final decision is transparent and auditable |
| **Neo4j** vs. SQL joins | Graph traversal (cycle detection, community analysis) is O(n) in Neo4j vs. O(n³) with self-joins |
| **PSI with HMAC** vs. raw data sharing | Regulatory compliance — banks can participate in collective fraud detection without sharing PII |
| **Redis** for fingerprints vs. PostgreSQL | Sub-millisecond lookups for real-time duplicate detection at scale |
| **Gemini** for LLM layer | Multimodal capability (future: directly analyze invoice images) + cost-effective API |
| **Deterministic scoring** + AI narrative | Auditable decisions for regulators + human-friendly explanations for analysts |

---

## 🌍 Impact & Market Opportunity

### The Numbers

| Metric | Value |
|---|---|
| **Global SCF fraud losses (annual)** | $5.2 Billion+ |
| **Average phantom invoice scheme duration** | 18 months before detection |
| **Multi-tier cascade amplification** | 2–5× the original fraudulent amount |
| **IntelliTrace detection latency** | < 400ms per invoice |
| **Fraud personas classified** | 10 distinct types |

### Who Benefits

| Stakeholder | Impact |
|---|---|
| **Banks & Lenders** | Pre-disbursement early warning prevents financing phantom invoices |
| **Insurers** | Reduced trade credit insurance claims through consortium intelligence |
| **Corporates** | Supply chain integrity assurance for ESG compliance |
| **Regulators** | Auditable, explainable AI decisions with full layer provenance |

---

## 🛣️ Roadmap

- [ ] **Real-time streaming** — Kafka integration for continuous invoice monitoring
- [ ] **Blockchain anchoring** — Immutable audit trail on Hyperledger Fabric
- [ ] **Federated learning** — Cross-institution model training without data sharing
- [ ] **Mobile app** — React Native companion for on-the-go alerts
- [ ] **SWIFT/MT integration** — Direct parsing of trade finance messaging standards
- [ ] **Regulatory reporting** — Auto-generated SAR (Suspicious Activity Report) drafts

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python 3.10+, FastAPI, Pydantic, asyncio |
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Graph DB** | Neo4j (Bolt protocol) |
| **Cache/PSI** | Redis |
| **LLM** | Google Gemini Pro |
| **Charts** | Recharts, D3.js, Custom SVG |
| **Animations** | Framer Motion, DecryptedText |
| **Deployment** | Docker Compose, Uvicorn |

---

## 👥 Team

Built with ❤️ for the hackathon.

---

<p align="center">
  <strong>IntelliTrace</strong> — <em>Because fraud that spans three tiers and four banks cannot be stopped by checking one invoice at a time.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/STATUS-PRODUCTION_READY-2DD4BF?style=for-the-badge&labelColor=0a0a0f" alt="status" />
</p>
