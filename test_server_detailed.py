#!/usr/bin/env python3
"""Detailed test of Invoice Physics API."""
import sys
import os
import json
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend'))

from main import app
from demo_scenarios import get_phantom_cascade_invoice
from fastapi.testclient import TestClient

client = TestClient(app)

print("=" * 70)
print("INTELLITRACE - DETAILED PHANTOM CASCADE TEST")
print("=" * 70)

# Test with KNOWN FRAUDULENT invoice
print("\n[TEST] Fraudulent Invoice (Should be BLOCKED)")
print("-" * 70)
fraud_invoice = get_phantom_cascade_invoice()
print("Invoice Details:")
print(f"  - ID: {fraud_invoice['id']}")
print("  - Typology: Phantom invoice + cross-tier cascade + dilution + carousel")
print("  - Supplier: Shanghai Steel Co (Capacity: 500 tons/month)")
print("  - Claimed: 6,400 tons")
print("  - Route: Shanghai -> Rotterdam by SEA")
print("  - Claimed: 2 days (Actual: ~12+ days minimum)")
print("  - Related invoices: Tier 3 -> Tier 2 -> Tier 1 financed across 3 lenders")
print("  - ERP mismatch: PO / GRN / delivery all under-support the invoice")
print("-" * 70)

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
scf = results.get('scf', {})

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

print(f"\n  SCF Intelligence Details:")
print(f"    - ERP Reconciliation: {scf.get('erp_reconciliation', {}).get('verdict')}")
print(f"    - Dilution Risk: {scf.get('dilution_risk', {}).get('verdict')}")
print(f"    - Revenue Feasibility: {scf.get('revenue_feasibility', {}).get('verdict')}")
print(f"    - Tier Velocity: {scf.get('tier_velocity', {}).get('verdict')}")
print(f"    - Cascade Correlation: {scf.get('cascade_correlation', {}).get('verdict')}")
print(f"    - Early Warning: {scf.get('early_warning', {}).get('summary')}")

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
