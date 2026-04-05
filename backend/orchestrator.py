"""Orchestrator - Runs all 5 layers of Invoice Physics analysis."""
import time
import asyncio
from typing import Dict, Any
from datetime import datetime

# Layer 1: DNA
from layer1_dna.fingerprint import get_sha256_fingerprint, get_minhash_signature
from layer1_dna.registry import register_invoice
from layer1_dna.behavioral import score_submission_behavior

# Layer 2: Physics
from layer2_physics.routing import check_delivery_feasibility
from layer2_physics.capacity import check_supplier_capacity
from layer2_physics.causality_dag import check_temporal_causality

# Layer 3: Graph
from layer3_graph.cycle_detector import detect_fraud_rings, detect_communities
from layer3_graph.graph_builder import get_graph_builder

# Layer 4: LLM
from layer4_llm.explainer import generate_explanation, generate_decision_summary

# Layer 5: PSI
from layer5_psi.psi_engine import detect_cross_lender_rings


async def analyze_invoice_async(invoice: Dict[str, Any]) -> Dict[str, Any]:
    """Run all 5 layers asynchronously and return unified fraud decision."""
    
    results = {}
    all_flagged = []
    layer_scores = {}
    
    start_time = time.time()
    
    # ===== LAYER 1: DNA =====
    try:
        sha256 = get_sha256_fingerprint(invoice)
        minhash = get_minhash_signature(invoice)
        
        dna_result = register_invoice(invoice["id"], sha256, minhash)
        behavioral = score_submission_behavior(invoice.get("supplier_id", "unknown"), time.time())
        psi_result = detect_cross_lender_rings(sha256, requesting_lender="bank_main")
        
        results["dna"] = {
            "fingerprint": sha256[:16] + "...",
            "status": dna_result.get("status"),
            "original_id": dna_result.get("original_id"),
            "similar_ids": dna_result.get("similar_ids", [])[:5],
            "behavioral": behavioral,
            "psi": psi_result
        }
        
        # Calculate DNA score
        dna_score = 0
        if dna_result.get("status") != "NEW":
            dna_score += 3
            all_flagged.append("DNA")
        if behavioral.get("flagged"):
            dna_score += behavioral.get("anomaly_score", 0) * 3
            if "DNA" not in all_flagged:
                all_flagged.append("DNA")
        if psi_result.get("flagged"):
            dna_score += psi_result.get("severity_score", 0)
            if "DNA" not in all_flagged:
                all_flagged.append("DNA")
        
        layer_scores["dna"] = min(dna_score, 10)
        
    except Exception as e:
        results["dna"] = {"error": str(e), "flagged": False}
        layer_scores["dna"] = 0
    
    # ===== LAYER 2: Physics =====
    try:
        # Routing check
        routing = check_delivery_feasibility(
            invoice.get("origin", ""),
            invoice.get("destination", ""),
            invoice.get("transport_mode", "road"),
            invoice.get("claimed_days", 1.0)
        )
        
        # Capacity check
        capacity = check_supplier_capacity(
            invoice.get("supplier_id", "unknown"),
            invoice.get("quantity", 0),
            industry=invoice.get("industry")
        )
        
        # Causality check
        dates = invoice.get("dates", {})
        if hasattr(dates, 'dict'):
            dates = dates.dict()
        causality = check_temporal_causality(dates)
        
        results["physics"] = {
            "routing": routing,
            "capacity": capacity,
            "causality": causality
        }
        
        # Calculate Physics score
        physics_score = 0
        if routing.get("flagged"):
            severity = routing.get("severity", "MEDIUM")
            physics_score += {"CRITICAL": 10, "HIGH": 7, "MEDIUM": 4, "LOW": 2}.get(severity, 3)
            if "PHYSICS" not in all_flagged:
                all_flagged.append("PHYSICS")
        
        if capacity.get("flagged"):
            excess = capacity.get("excess_percentage", 0)
            physics_score += min(excess / 10, 10)
            if "PHYSICS" not in all_flagged:
                all_flagged.append("PHYSICS")
        
        if causality.get("flagged"):
            paradox = causality.get("paradox_score", 0)
            physics_score += paradox * 2
            if "PHYSICS" not in all_flagged:
                all_flagged.append("PHYSICS")
        
        layer_scores["physics"] = min(physics_score, 10)
        
    except Exception as e:
        results["physics"] = {"error": str(e), "flagged": False}
        layer_scores["physics"] = 0
    
    # ===== LAYER 3: Graph =====
    try:
        obligation_edges = invoice.get("obligation_edges", [])
        fraud_rings = detect_fraud_rings(obligation_edges)
        
        # Try to get edges from graph database
        try:
            gb = get_graph_builder()
            if gb.is_connected():
                db_edges = gb.get_all_edges()
                if db_edges:
                    all_edges = list(set(obligation_edges + db_edges))
                    fraud_rings = detect_fraud_rings(all_edges)
                    
                # Add invoice to graph for future detection
                gb.add_invoice_to_graph(invoice)
        except Exception:
            pass
        
        # Community detection
        communities = detect_communities(obligation_edges)
        
        results["graph"] = {
            **fraud_rings,
            "communities": communities
        }
        
        # Calculate Graph score
        graph_score = 0
        if fraud_rings.get("flagged"):
            cycles = fraud_rings.get("cycles_found", 0)
            graph_score += min(cycles * 2, 10)
            if "GRAPH" not in all_flagged:
                all_flagged.append("GRAPH")
        
        if communities.get("flagged"):
            graph_score += 3
            if "GRAPH" not in all_flagged:
                all_flagged.append("GRAPH")
        
        layer_scores["graph"] = min(graph_score, 10)
        
    except Exception as e:
        results["graph"] = {"error": str(e), "flagged": False}
        layer_scores["graph"] = 0
    
    # ===== LAYER 4: LLM Explanation =====
    try:
        violations_for_llm = {
            "dna": results.get("dna", {}),
            "behavioral": results.get("dna", {}).get("behavioral", {}),
            "psi": results.get("dna", {}).get("psi", {}),
            "physics": results.get("physics", {}),  # Pass full physics object
            "graph": results.get("graph", {})
        }
        
        explanation = generate_explanation(violations_for_llm)
        results["explanation"] = explanation
        
    except Exception as e:
        print(f"Explanation generation error: {e}")
        results["explanation"] = f"Analysis complete. {len(all_flagged)} layers flagged."
    
    # ===== LAYER 5: PSI (already done in Layer 1) =====
    results["psi"] = results.get("dna", {}).get("psi", {})
    
    # ===== DECISION ENGINE =====
    total_score = sum(layer_scores.values())
    max_possible = len(layer_scores) * 10
    risk_percentage = (total_score / max_possible) * 100 if max_possible > 0 else 0
    
    # Decision logic
    critical_count = sum(1 for k, v in layer_scores.items() if v >= 8)
    high_count = sum(1 for k, v in layer_scores.items() if v >= 5)
    
    if critical_count >= 2 or total_score >= 20 or "DNA" in all_flagged and results.get("dna", {}).get("status") == "DUPLICATE":
        decision = "BLOCK"
    elif len(all_flagged) >= 2 or total_score >= 10 or critical_count >= 1:
        decision = "HOLD"
    else:
        decision = "APPROVE"
    
    # Decision override for PSI multi-lender
    psi_data = results.get("psi", {})
    if psi_data.get("other_count", 0) >= 3:
        decision = "BLOCK"
    elif psi_data.get("other_count", 0) >= 2 and decision == "APPROVE":
        decision = "HOLD"
    
    processing_time = round(time.time() - start_time, 3)
    
    return {
        "invoice_id": invoice.get("id"),
        "decision": decision,
        "confidence": round(min(risk_percentage / 100, 1.0), 2),
        "risk_score": round(risk_percentage, 1),
        "layers_flagged": all_flagged,
        "layer_scores": layer_scores,
        "results": results,
        "explanation": results.get("explanation", ""),
        "processing_time_seconds": processing_time,
        "timestamp": datetime.utcnow().isoformat()
    }


def analyze_invoice(invoice: Dict[str, Any]) -> Dict[str, Any]:
    """Synchronous wrapper for analyze_invoice_async."""
    return asyncio.run(analyze_invoice_async(invoice))


# For testing
if __name__ == "__main__":
    test_invoice = {
        "id": "INV-TEST-001",
        "supplier": "Shanghai Steel Co",
        "supplier_id": "shanghai_steel",
        "buyer": "Rotterdam Imports",
        "buyer_id": "rotterdam_imports",
        "amount": 4700000,
        "items": ["steel_coils", "steel_plates"],
        "origin": "shanghai",
        "destination": "rotterdam",
        "transport_mode": "sea",
        "claimed_days": 2,
        "quantity": 8000,
        "dates": {
            "po_date": "2024-01-10",
            "invoice_date": "2024-01-06",
            "finance_request_date": "2024-01-05"
        },
        "obligation_edges": []
    }
    
    result = analyze_invoice(test_invoice)
    print(f"Decision: {result['decision']}")
    print(f"Layers Flagged: {result['layers_flagged']}")
    print(f"Explanation: {result['explanation']}")
