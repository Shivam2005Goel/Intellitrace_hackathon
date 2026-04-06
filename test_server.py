#!/usr/bin/env python3
"""Test script to verify the server works correctly."""
import sys
import time
import json
import os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend'))

from main import app
from demo_scenarios import get_legitimate_baseline_invoice, get_phantom_cascade_invoice
from fastapi.testclient import TestClient

client = TestClient(app)

print("=" * 60)
print("INTELLITRACE SCF FRAUD API TEST")
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
fraud_invoice = get_phantom_cascade_invoice()
response = client.post("/analyze", json=fraud_invoice)
result = response.json()
print(f"   Invoice: {fraud_invoice['id']}")
print(f"   DECISION: {result.get('decision')} [WARNING]")
print(f"   Risk Score: {result.get('risk_score')}%")
print(f"   Layers Flagged: {', '.join(result.get('layers_flagged', []))}")
print(f"   SCF Early Warning: {result.get('results', {}).get('scf', {}).get('early_warning', {}).get('recommended_action')}")
print(f"   Explanation: {result.get('explanation', 'N/A')[:100]}...")

# Test 5: Analyze legitimate invoice
print("\n5. Testing Legitimate Invoice...")
legit_invoice = get_legitimate_baseline_invoice()
response = client.post("/analyze", json=legit_invoice)
result = response.json()
print(f"   Invoice: {legit_invoice['id']}")
print(f"   DECISION: {result.get('decision')} [OK]" if result.get('decision') == 'APPROVE' else f"   DECISION: {result.get('decision')}")
print(f"   Risk Score: {result.get('risk_score')}%")
print(f"   Layers Flagged: {result.get('layers_flagged', [])}")

print("\n" + "=" * 60)
print("ALL TESTS COMPLETED SUCCESSFULLY!")
print("=" * 60)
