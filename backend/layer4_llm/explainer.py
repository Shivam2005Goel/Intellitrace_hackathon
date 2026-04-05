# Layer 4: LLM Explainer - Generate plain-English fraud explanations.
from typing import Dict, Any, Optional
import os


def generate_explanation(violations: Dict[str, Any]) -> str:
    """Generate plain-English fraud explanation."""
    
    # Build violation summary
    parts = []
    
    # Physics violations
    physics = violations.get("physics", {})
    routing = physics.get("routing", {})
    capacity = physics.get("capacity", {})
    causality = physics.get("causality", {})
    
    if routing.get("flagged"):
        claimed = routing.get("claimed_days", "?")
        minimum = routing.get("total_minimum_days", "?")
        mode = routing.get("transport_mode", "?")
        origin = routing.get("origin", "?")
        dest = routing.get("destination", "?")
        parts.append(f"Delivery from {origin} to {dest} by {mode} claimed {claimed} days, but minimum possible is {minimum} days.")
    
    if capacity.get("flagged"):
        excess = capacity.get("excess_percentage", "?")
        supplier = capacity.get("supplier_id", "?")
        parts.append(f"Supplier {supplier} exceeded capacity by {excess}%.")
    
    # Causality violations
    if causality.get("flagged"):
        for v in causality.get("violations", []):
            parts.append(v)
    
    # DNA violations
    dna = violations.get("dna", {})
    if dna.get("status") == "DUPLICATE":
        parts.append("Exact duplicate invoice fingerprint found in cross-lender registry.")
    elif dna.get("status") == "FUZZY_MATCH":
        parts.append("Similar invoice previously submitted - potential modification of existing invoice.")
    
    behavioral = violations.get("behavioral", {})
    if behavioral.get("flagged"):
        count = behavioral.get("submissions_last_hour", "many")
        parts.append(f"Suspicious submission pattern: {count} invoices in last hour.")
    
    # PSI violations
    psi = violations.get("psi", {})
    if psi.get("flagged"):
        count = psi.get("count", "multiple")
        parts.append(f"Cross-lender fraud alert: invoice seen at {count} different lenders.")
    
    # Graph violations
    graph = violations.get("graph", {})
    if graph.get("flagged"):
        cycles = graph.get("cycles_found", 0)
        parts.append(f"Detected {cycles} circular trading patterns in supply chain network.")
    
    violation_text = " ".join(parts)
    
    if not violation_text:
        return "No significant anomalies detected. Invoice appears consistent with normal patterns."
    
    # Try Gemini Agent if available
    try:
        from core.agent import generate_fraud_explanation
        
        # Calculate severity
        critical_count = sum(1 for k, v in violations.items() if isinstance(v, dict) and v.get("severity") == "CRITICAL")
        high_count = sum(1 for k, v in violations.items() if isinstance(v, dict) and v.get("severity") == "HIGH")
        severity = "CRITICAL" if critical_count > 0 else "HIGH" if high_count > 0 else "MODERATE"
        
        llm_expl = generate_fraud_explanation(violation_text, severity)
        if llm_expl:
            return llm_expl
    except Exception as e:
        print(f"Gemini generation failed: {e}")
    
    # Fallback to rule-based explanation
    return _generate_rule_explanation(violations)





def _generate_rule_explanation(violations: Dict[str, Any]) -> str:
    """Generate rule-based explanation as fallback."""
    
    explanations = []
    
    # Physics issues
    physics = violations.get("physics", {})
    routing = physics.get("routing", {})
    capacity = physics.get("capacity", {})
    causality = physics.get("causality", {})
    
    if routing.get("flagged"):
        claimed = routing.get("claimed_days")
        minimum = routing.get("total_minimum_days")
        mode = routing.get("transport_mode", "transport")
        if claimed and minimum:
            ratio = claimed / minimum if minimum > 0 else 0
            if ratio < 0.5:
                explanations.append(f"Physically impossible: Claimed {claimed} days for {mode} delivery would require breaking known speed limits (minimum {minimum} days).")
            else:
                explanations.append(f"Suspicious delivery time: {claimed} days claimed but {minimum} days minimum required for {mode} transport.")
    
    if capacity.get("flagged"):
        excess = capacity.get("excess_percentage")
        supplier = capacity.get("supplier_id")
        if excess and excess > 100:
            explanations.append(f"Capacity fraud: Supplier {supplier} claimed production {excess:.0f}% above their verified monthly capacity.")
        else:
            explanations.append(f"Capacity warning: Supplier {supplier} near or exceeding production limits.")
    
    if causality.get("flagged"):
        caus_violations = causality.get("violations", [])
        if caus_violations:
            explanations.append(f"Timeline paradox detected: {'; '.join(caus_violations[:2])}.")
    
    # DNA issues
    dna = violations.get("dna", {})
    if dna.get("status") == "DUPLICATE":
        explanations.append("Duplicate submission: Exact same invoice fingerprint detected in cross-lender registry.")
    elif dna.get("status") == "FUZZY_MATCH":
        similar = dna.get("similar_ids", [])
        explanations.append(f"Modified duplicate: Invoice closely matches {len(similar)} previously submitted invoice(s).")
    
    behavioral = violations.get("behavioral", {})
    if behavioral.get("flagged"):
        explanations.append("Submission velocity anomaly: Unusual frequency of invoices from this supplier.")
    
    psi = violations.get("psi", {})
    if psi.get("flagged"):
        count = psi.get("count", 0)
        explanations.append(f"Multi-lender fraud: Invoice fingerprint detected across {count} different financial institutions.")
    
    graph = violations.get("graph", {})
    if graph.get("flagged"):
        cycles = graph.get("cycles_found", 0)
        companies = graph.get("companies_involved", 0)
        explanations.append(f"Circular trading network: Detected {cycles} closed-loop transaction patterns involving {companies} companies.")
    
    if not explanations:
        return "No significant fraud indicators detected. Invoice cleared for processing."
    
    return " ".join(explanations[:3])  # Max 3 points


def generate_decision_summary(result: Dict[str, Any]) -> str:
    """Generate a summary of the decision."""
    decision = result.get("decision", "UNKNOWN")
    layers = result.get("layers_flagged", [])
    
    if decision == "BLOCK":
        return f"BLOCK: Multiple critical violations detected across {', '.join(layers)}. Immediate intervention required."
    elif decision == "HOLD":
        return f"HOLD: Suspicious patterns detected in {', '.join(layers)}. Manual review recommended."
    else:
        return "APPROVE: No significant anomalies detected. Standard processing approved."
