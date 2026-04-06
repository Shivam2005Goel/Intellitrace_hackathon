"""Layer 5: Cascade-Exposure Counterfactual Engine (Feature 7)."""
from typing import Dict, Any

def compute_cascade_exposure(invoice: Dict[str, Any]) -> Dict[str, Any]:
    """Feature 7: Simulates 'what if we blocked this?' up the supply chain cascade."""
    amount = invoice.get("amount", 0)
    
    # We estimate downstream exposure based on typical cascading supply chains.
    # E.g., preventing $1M fraud here might prevent $1.5M in subsequent synthetic loans down the line.
    multiplier = 1.6
    saved = amount * multiplier
    
    return {
        "downstream_exposure_if_blocked": float(saved),
        "message": f"Blocking this invoice would prevent an estimated ${saved:,.2f} in downstream cascading fraud exposure."
    }
