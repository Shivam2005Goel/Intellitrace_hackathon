"""Layer 3: Advanced Graph Features (Features 1, 4, 5)."""
from typing import Dict, Any

def detect_tier_shifting(graph_builder, invoice: Dict[str, Any]) -> Dict[str, Any]:
    """Feature 1: Detect Tier-Shifting (Tier-Hopping Anomaly)."""
    if not graph_builder.is_connected() or getattr(graph_builder, '_use_memory', False):
        return {"flagged": False, "tier_shifting_score": 0, "violations": []}
        
    supplier_id = invoice.get("supplier_id")
    
    score = 0
    flagged = False
    details = []
    
    try:
        with graph_builder.driver.session() as session:
            # Simple heuristic for role hopping: Acts as supplier to many diverse buyers
            # In a real system we'd check against banks, but here we query out-degree
            res = session.run("""
                MATCH (s:Company {id: $supplier_id})-[r:SUPPLIES]->(b:Company)
                RETURN count(DISTINCT b.id) as num_buyers
            """, supplier_id=supplier_id)
            record = res.single()
            num_buyers = record["num_buyers"] if record else 0
            
            if num_buyers > 3:
                score += 5
                flagged = True
                details.append(f"Company acts as a supplier to {num_buyers} different buyers (Tier-hopping signature).")
    except Exception as e:
        pass
        
    return {"flagged": flagged, "tier_shifting_score": min(score, 10), "violations": details}

def detect_shadow_tier(graph_builder, invoice: Dict[str, Any]) -> Dict[str, Any]:
    """Feature 4: Shadow-Tier / Ghost-Company Graph."""
    if not graph_builder.is_connected() or getattr(graph_builder, '_use_memory', False):
        return {"flagged": False, "shadow_tier_score": 0, "shadow_suppliers": 0}
        
    supplier_id = invoice.get("supplier_id")
    score = 0
    flagged = False
    shadow_suppliers = 0
    
    try:
        with graph_builder.driver.session() as session:
            # hub_score = number of Tier-3s supplying it
            res = session.run("""
                MATCH (t3:Company)-[:SUPPLIES]->(c:Company {id: $supplier_id})
                RETURN count(t3) as shadow_suppliers
            """, supplier_id=supplier_id)
            record = res.single()
            shadow_suppliers = record["shadow_suppliers"] if record else 0
            
            if shadow_suppliers > 5:
                score += 7
                flagged = True
    except Exception as e:
        pass
        
    return {"flagged": flagged, "shadow_tier_score": min(score, 10), "shadow_suppliers": shadow_suppliers}

def detect_cash_rebound(graph_builder, invoice: Dict[str, Any]) -> Dict[str, Any]:
    """Feature 5: Cash-Rebound / Self-Funding Loop."""
    if not graph_builder.is_connected() or getattr(graph_builder, '_use_memory', False):
        return {"flagged": False, "cash_rebound_score": 0, "violations": []}
    
    supplier_id = invoice.get("supplier_id")
    buyer_id = invoice.get("buyer_id")
    
    try:
        with graph_builder.driver.session() as session:
            # Search for a path where money flows back (buyer to supplier via other companies)
            res = session.run("""
                MATCH path = (buyer:Company {id: $buyer_id})-[:SUPPLIES*1..4]->(supplier:Company {id: $supplier_id})
                RETURN length(path) as loop_len LIMIT 1
            """, buyer_id=buyer_id, supplier_id=supplier_id)
            record = res.single()
            if record:
                return {
                    "flagged": True, 
                    "cash_rebound_score": 10,
                    "violations": [f"Cash rebound loop detected of length {record['loop_len']}!"]
                }
    except Exception as e:
        pass
        
    return {"flagged": False, "cash_rebound_score": 0, "violations": []}
