"""Layer 2: Supplier capacity verification."""
from typing import Dict, Any

# Simulated supplier capacity database (in production, this would be from ERP/DB)
SUPPLIER_CAPACITY = {
    # supplier_id: monthly_capacity_tons
    "SUP001": 500,
    "SUP002": 2000,
    "SUP003": 10000,
    "SUP004": 1500,
    "SUP005": 3000,
    "SUP006": 750,
    "SUP007": 5000,
    "SUP008": 1200,
    "SUP009": 2500,
    "SUP010": 800,
    "shanghai_steel": 500,
    "rotterdam_imports": 10000,
    "global_textiles": 2000,
    "tech_components": 1500,
    "auto_parts_inc": 3000,
}

# Industry average capacity factors (for unknown suppliers)
INDUSTRY_DEFAULTS = {
    "steel": 2000,
    "textile": 1500,
    "electronics": 1000,
    "automotive": 2500,
    "chemical": 5000,
    "food": 3000,
    "general": 1000,
}


def get_supplier_capacity(supplier_id: str, industry: str = None) -> float:
    """Get supplier capacity from database or estimate from industry."""
    # Direct lookup
    capacity = SUPPLIER_CAPACITY.get(supplier_id.upper())
    if capacity:
        return capacity
    
    # Try case-insensitive lookup
    sid_lower = supplier_id.lower()
    for key, cap in SUPPLIER_CAPACITY.items():
        if key.lower() == sid_lower or sid_lower in key.lower():
            return cap
    
    # Industry-based estimate
    if industry:
        ind_lower = industry.lower()
        for key, cap in INDUSTRY_DEFAULTS.items():
            if key in ind_lower or ind_lower in key:
                return cap
    
    # Default fallback
    return 1000


def check_supplier_capacity(
    supplier_id: str, 
    claimed_quantity: float,
    timeframe_months: float = 1.0,
    industry: str = None
) -> Dict[str, Any]:
    """Check if supplier can actually produce the claimed quantity."""
    
    max_capacity = get_supplier_capacity(supplier_id, industry)
    adjusted_capacity = max_capacity * timeframe_months
    
    excess = claimed_quantity - adjusted_capacity
    excess_pct = ((claimed_quantity - adjusted_capacity) / adjusted_capacity * 100) if adjusted_capacity > 0 else float('inf')
    
    utilization_rate = (claimed_quantity / adjusted_capacity * 100) if adjusted_capacity > 0 else 0
    
    # Determine severity and flags
    if excess_pct > 100:
        severity = "CRITICAL"
        flagged = True
    elif excess_pct > 50:
        severity = "HIGH"
        flagged = True
    elif excess_pct > 20:
        severity = "MEDIUM"
        flagged = True
    elif utilization_rate > 90:
        severity = "WARNING"
        flagged = False  # Near capacity but not exceeding
    else:
        severity = "NONE"
        flagged = False
    
    return {
        "supplier_id": supplier_id,
        "industry": industry,
        "max_monthly_capacity": max_capacity,
        "timeframe_months": timeframe_months,
        "adjusted_capacity": round(adjusted_capacity, 2),
        "claimed_quantity": claimed_quantity,
        "excess_quantity": round(excess, 2) if excess > 0 else 0,
        "excess_percentage": round(excess_pct, 1),
        "utilization_rate": round(utilization_rate, 1),
        "severity": severity,
        "flagged": flagged,
        "status": "EXCEEDED" if flagged else "WITHIN_CAPACITY",
        "verdict": (f"CAPACITY EXCEEDED BY {excess_pct:.0f}%" if flagged 
                   else f"WITHIN CAPACITY ({utilization_rate:.0f}% utilization)")
    }


def check_bulk_capacity(supplier_id: str, quantities: list, industries: list = None) -> Dict[str, Any]:
    """Check capacity for multiple items/quantities."""
    total_quantity = sum(quantities)
    
    # Determine primary industry
    primary_industry = industries[0] if industries else None
    
    result = check_supplier_capacity(supplier_id, total_quantity, industry=primary_industry)
    result["item_count"] = len(quantities)
    result["individual_quantities"] = quantities
    
    return result
