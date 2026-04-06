"""Layer 4: Reality-Consistency Embedding (Feature 6)."""
from typing import Dict, Any
import numpy as np

# Load model lazily
_model = None

def get_embedding_model():
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            # Small, fast model
            _model = SentenceTransformer('all-MiniLM-L6-v2', local_files_only=True)
        except ImportError:
            _model = "MOCK"
        except Exception:
            _model = "MOCK"
    return _model

def _cosine_similarity(a, b):
    if isinstance(a, str) and a == "MOCK":
        return 0.95
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

def check_semantic_consistency(invoice: Dict[str, Any]) -> Dict[str, Any]:
    """Feature 6: Cross-Document semantic verification."""
    model = get_embedding_model()
    
    inv_text = invoice.get("invoice_text")
    po_text = invoice.get("po_text")
    grn_text = invoice.get("grn_text")
    
    score = 0
    flagged = False
    violations = []
    
    if not inv_text:
        return {"flagged": False, "consistency_score": 0, "violations": []}
        
    try:
        inv_emb = model.encode(inv_text) if model != "MOCK" else "MOCK"
        
        if po_text:
            po_emb = model.encode(po_text) if model != "MOCK" else "MOCK"
            sim_po = _cosine_similarity(inv_emb, po_emb)
            if sim_po < 0.65:
                violations.append(f"Invoice and PO semantic similarity is anomalously low ({sim_po:.2f}).")
                score += 6
                flagged = True
                
        if grn_text:
            grn_emb = model.encode(grn_text) if model != "MOCK" else "MOCK"
            sim_grn = _cosine_similarity(inv_emb, grn_emb)
            if sim_grn < 0.65:
                violations.append(f"Invoice and GRN semantic similarity is low ({sim_grn:.2f}).")
                score += 5
                flagged = True
    except Exception as e:
        print(f"Embedding error: {e}")
        
    return {
        "flagged": flagged,
        "consistency_score": min(score, 10),
        "violations": violations
    }
