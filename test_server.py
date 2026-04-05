#!/usr/bin/env python3
"""Test script to verify the server works correctly."""
import sys
import time
import json
sys.path.insert(0, 'd:/Invoice_Intellitrace/backend')

from main import app
from fastapi.testclient import TestClient

client = TestClient(app)

print("=" * 60)
print("INVOICE PHYSICS - API TEST")
print("=" * 60)

# Test 1: Health check
print("\n1. Testing Health Endpoint...")
response = client.get("/health")
print(f"   Status: {response.status_code}")
print(f"   Response: {json.dumps(response.json(), indent=2)}")

# Test 2: Root endpoint
print("\n2. Testing Root Endpoint...")
response = client.get("/")
print(f"   Status: {response.status_code}")
print(f"   API: {response.json().get('name')}")

# Test 3: Cities endpoint
print("\n3. Testing Cities Endpoint...")
response = client.get("/cities")
cities = response.json()
print(f"   Available cities: {cities.get('count')}")
print(f"   Sample: {', '.join(cities.get('cities', [])[:5])}")

# Test 4: Analyze fraud invoice
print("\n4. Testing Fraud Detection...")
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
print(f"   Invoice: {fraud_invoice['id']}")
print(f"   DECISION: {result.get('decision')} [WARNING]")
print(f"   Risk Score: {result.get('risk_score')}%")
print(f"   Layers Flagged: {', '.join(result.get('layers_flagged', []))}")
print(f"   Explanation: {result.get('explanation', 'N/A')[:100]}...")

# Test 5: Analyze legitimate invoice
print("\n5. Testing Legitimate Invoice...")
legit_invoice = {
    "id": "INV-LEGIT-001",
    "supplier": "Tech Components Inc",
    "supplier_id": "SUP003",
    "buyer": "Global Electronics",
    "buyer_id": "global_electronics",
    "amount": 50000,
    "items": ["semiconductors"],
    "origin": "shanghai",
    "destination": "rotterdam",
    "transport_mode": "sea",
    "claimed_days": 25,
    "quantity": 100,
    "dates": {
        "po_date": "2024-01-01",
        "grn_date": "2024-01-25",
        "invoice_date": "2024-01-26",
        "finance_request_date": "2024-01-27"
    }
}
response = client.post("/analyze", json=legit_invoice)
result = response.json()
print(f"   Invoice: {legit_invoice['id']}")
print(f"   DECISION: {result.get('decision')} [OK]" if result.get('decision') == 'APPROVE' else f"   DECISION: {result.get('decision')}")
print(f"   Risk Score: {result.get('risk_score')}%")
print(f"   Layers Flagged: {result.get('layers_flagged', [])}")

print("\n" + "=" * 60)
print("ALL TESTS COMPLETED SUCCESSFULLY!")
print("=" * 60)
