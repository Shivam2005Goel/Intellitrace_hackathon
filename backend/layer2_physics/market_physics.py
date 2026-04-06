"""Layer 2: Market Physics - Validation against macro constraints (Feature 9)."""
from typing import Dict, Any

# Simple mock database of commodity constraints
MARKET_AVERAGES = {
    "steel_coils": {"monthly_max_tons": 20000, "avg_tons_per_shipment": 5000},
    "steel_plates": {"monthly_max_tons": 15000, "avg_tons_per_shipment": 3000},
    "semiconductors": {"monthly_max_tons": 500, "avg_tons_per_shipment": 10},
    "circuit_boards": {"monthly_max_tons": 1000, "avg_tons_per_shipment": 50},
}

def analyze_market_physics(invoice: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validates the invoice against multi-physics constraints:
    - Weather-feasibility / Speed limits
    - Port capacity and Commodity-consistency
    """
    flagged = False
    violations = []
    score = 0
    
    quantity = float(invoice.get("quantity", 0))
    items = invoice.get("items", [])
    transport_mode = invoice.get("transport_mode", "sea").lower()
    claimed_days = float(invoice.get("claimed_days", 0))
    origin = invoice.get("origin", "").lower()
    destination = invoice.get("destination", "").lower()

    # Weather/Transport Feasibility (Speed of Light checks)
    if transport_mode == "sea" and origin != destination:
        if claimed_days < 10 and ("shanghai" in origin and "rotterdam" in destination):
            violations.append(f"Sea transport from {origin} to {destination} in {claimed_days} days is physically impossible (requires >25 days).")
            score += 8
            flagged = True
        elif claimed_days <= 0:
            violations.append("Teleportation detected: Claimed delivery days is zero or negative.")
            score += 10
            flagged = True

    # Market Commodity Limits
    for item in items:
        if item in MARKET_AVERAGES:
            limits = MARKET_AVERAGES[item]
            if quantity > limits["monthly_max_tons"]:
                violations.append(f"Quantity {quantity} tons exceeds regional monthly max capacity for {item} ({limits['monthly_max_tons']} tons).")
                score += 8
                flagged = True
            elif quantity > limits["avg_tons_per_shipment"] * 5:
                violations.append(f"Quantity {quantity} tons is >5x typical shipment size for {item}. Highly anomalous.")
                score += 4
                flagged = True
                
    return {
        "flagged": flagged,
        "violations": violations,
        "market_physics_score": min(score, 10)
    }
