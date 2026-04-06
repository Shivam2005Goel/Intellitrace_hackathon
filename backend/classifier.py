"""Fraud Persona Classifier (Feature 10)."""
from typing import Dict, Any

def classify_fraud_persona(layer_results: Dict[str, Any]) -> Dict[str, float]:
    """
    Feature 10: Map numerical anomalies into specific Fraud Pattern Categories (Personas).
    e.g., Tier-Hopping, Cash-Rebound, Shadow-Tier, Gap-Phantom
    """
    phys = layer_results.get("physics", {})
    graph = layer_results.get("graph", {})
    dna = layer_results.get("dna", {})
    scf = layer_results.get("scf", {})
    
    # Extract specific scores
    tier_hopping_score = graph.get("tier_shifting", {}).get("tier_shifting_score", 0)
    cash_rebound = graph.get("cash_rebound", {}).get("cash_rebound_score", 0)
    shadow_tier = graph.get("shadow_tier", {}).get("shadow_tier_score", 0)
    inverse_cause = phys.get("causality", {}).get("paradox_score", 0)
    resonance_score = dna.get("behavioral", {}).get("resonance_score", 0)
    phantom_cascade = scf.get("cascade_correlation", {}).get("score", 0)
    dilution_score = scf.get("dilution_risk", {}).get("score", 0)
    double_financing_score = scf.get("tier_velocity", {}).get("score", 0)
    relationship_gap = scf.get("relationship_gap", {}).get("score", 0)
    carousel_score = scf.get("carousel_risk", {}).get("score", 0)
    
    personas = {
        "tier_hopping": min(tier_hopping_score / 10.0, 1.0),
        "cash_rebound": min(cash_rebound / 10.0, 1.0),
        "shadow_tier": min(shadow_tier / 10.0, 1.0),
        "gap_phantom_backward": min(inverse_cause / 10.0, 1.0),
        "temporal_rhythm_fraud": min(resonance_score / 10.0, 1.0),
        "phantom_cascade": min(phantom_cascade / 10.0, 1.0),
        "dilution_fraud": min(dilution_score / 10.0, 1.0),
        "double_financing": min(double_financing_score / 10.0, 1.0),
        "relationship_gap": min(relationship_gap / 10.0, 1.0),
        "carousel_trade": min(carousel_score / 10.0, 1.0),
    }
    
    return personas
