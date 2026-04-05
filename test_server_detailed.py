#!/usr/bin/env python3
"""Detailed test of Invoice Physics API."""
import sys
import json
sys.path.insert(0, 'd:/Invoice_Intellitrace/backend')

from main import app
from fastapi.testclient import TestClient

client = TestClient(app)

print("=" * 70)
print("INVOICE PHYSICS - DETAILED FRAUD DETECTION TEST")
print("=" * 70)

# Test with KNOWN FRAUDULENT invoice
print("\n[TEST] Fraudulent Invoice (Should be BLOCKED)")
print("-" * 70)
print("Invoice Details:")
print("  - ID: INV-FRAUD-001")
print("  - Supplier: Shanghai Steel Co (Capacity: 500 tons/month)")
print("  - Claimed: 8,000 tons")
print("  - Route: Shanghai -> Rotterdam by SEA")
print("  - Claimed: 2 days (Actual: ~20 days)")
print("  - Dates: Invoice (Jan 6) BEFORE PO (Jan 10)")
print("-" * 70)

fraud_invoice = {
    "id": "INV-FRAUD-001",
    "supplier": "Shanghai Steel Co",
    "supplier_id": "shanghai_steel",
    "buyer": "Rotterdam Imports",
    "buyer_id": "rotterdam_imports",
    "amount": 4700000,
    "items": ["steel_coils"],
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
}

response = client.post("/analyze", json=fraud_invoice)
result = response.json()

print(f"\nRESULTS:")
print(f"  Decision: {result.get('decision')}")
print(f"  Risk Score: {result.get('risk_score')}%")
print(f"  Confidence: {result.get('confidence')}")
print(f"  Layers Flagged: {result.get('layers_flagged')}")
print(f"  Layer Scores: {json.dumps(result.get('layer_scores', {}), indent=2)}")
print(f"  Processing Time: {result.get('processing_time_seconds')}s")

print(f"\n  AI Explanation:")
print(f"  {result.get('explanation')}")

# Detailed results
results = result.get('results', {})
physics = results.get('physics', {})

print(f"\n  Physics Layer Details:")
routing = physics.get('routing', {})
print(f"    - Distance: {routing.get('distance_km')} km")
print(f"    - Claimed Days: {routing.get('claimed_days')}")
print(f"    - Minimum Days: {routing.get('total_minimum_days')}")
print(f"    - Physically Possible: {routing.get('physically_possible')}")
print(f"    - Flagged: {routing.get('flagged')}")

capacity = physics.get('capacity', {})
print(f"    - Supplier Capacity: {capacity.get('max_monthly_capacity')} tons")
print(f"    - Claimed Quantity: {capacity.get('claimed_quantity')} tons")
print(f"    - Excess: {capacity.get('excess_percentage')}%")
print(f"    - Flagged: {capacity.get('flagged')}")

causality = physics.get('causality', {})
print(f"    - Temporal Violations: {causality.get('violations', [])}")
print(f"    - Paradox Score: {causality.get('paradox_score')}")
print(f"    - Flagged: {causality.get('flagged')}")

print("\n" + "=" * 70)
print("TEST COMPLETE")
print("=" * 70)
print("\nEXPECTED: BLOCK (Multiple critical violations)")
print(f"ACTUAL: {result.get('decision')}")

if result.get('decision') == 'BLOCK':
    print("STATUS: PASS - Fraud correctly detected!")
elif result.get('decision') == 'HOLD':
    print("STATUS: PARTIAL - Flagged for review (HOLD)")
else:
    print("STATUS: FAIL - Fraud not detected!")
