"""Layer 5: Cascade-Exposure Counterfactual Engine (Feature 7)."""
from typing import Dict, Any

def compute_cascade_exposure(invoice: Dict[str, Any]) -> Dict[str, Any]:
    """Feature 7: Simulates 'what if we blocked this?' up the supply chain cascade."""
    amount = float(invoice.get("amount", 0) or 0)
    related_invoices = [node for node in (invoice.get("related_invoices") or []) if isinstance(node, dict)]
    tier_levels = {
        int(node.get("tier_level", 0) or 0)
        for node in related_invoices
        if node.get("tier_level") is not None
    }
    tier_levels.add(int(invoice.get("tier_level", 1) or 1))

    if related_invoices:
        total_chain_amount = sum(float(node.get("amount", 0) or 0) for node in related_invoices) + amount
        financing_multiplier = total_chain_amount / max(amount, 1.0)
        tier_amplifier = 1 + max(len(tier_levels) - 1, 0) * 0.2
        multiplier = max(1.6, round(financing_multiplier * tier_amplifier, 2))
        saved = max(total_chain_amount, amount * multiplier)
    else:
        multiplier = 1.6
        saved = amount * multiplier

    return {
        "downstream_exposure_if_blocked": float(saved),
        "cascade_multiplier": float(multiplier),
        "related_invoice_count": len(related_invoices),
        "message": f"Blocking this invoice would prevent an estimated ${saved:,.2f} in downstream cascading fraud exposure."
    }
