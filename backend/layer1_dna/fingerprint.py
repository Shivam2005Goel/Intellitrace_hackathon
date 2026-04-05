"""Layer 1: Invoice DNA - Fingerprinting and duplicate detection."""
import hashlib
import json
from datasketch import MinHash, MinHashLSH
from typing import Dict, Any

# Lazy load sentence transformer (optional)
_model = None
_sentence_transformers_available = None

def _check_sentence_transformers():
    global _sentence_transformers_available
    if _sentence_transformers_available is None:
        try:
            import sentence_transformers
            _sentence_transformers_available = True
        except ImportError:
            _sentence_transformers_available = False
    return _sentence_transformers_available

def get_model():
    global _model
    if _model is None and _check_sentence_transformers():
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer('all-MiniLM-L6-v2')
    return _model


def canonicalize_invoice(invoice: Dict[str, Any]) -> str:
    """Normalize invoice to remove formatting differences."""
    # Handle both dict and Pydantic model
    if hasattr(invoice, 'dict'):
        invoice = invoice.dict()
    
    # Handle dates object
    dates = invoice.get('dates', {})
    if hasattr(dates, 'dict'):
        dates = dates.dict()
    
    canonical = {
        "supplier": str(invoice.get("supplier", "")).strip().lower(),
        "buyer": str(invoice.get("buyer", "")).strip().lower(),
        "amount": round(float(invoice.get("amount", 0)), 2),
        "items": sorted([str(i).lower().strip() for i in invoice.get("items", [])]),
        "origin": str(invoice.get("origin", "")).strip().lower(),
        "destination": str(invoice.get("destination", "")).strip().lower(),
        "quantity": round(float(invoice.get("quantity", 0)), 2),
    }
    return json.dumps(canonical, sort_keys=True)


def get_sha256_fingerprint(invoice: Dict[str, Any]) -> str:
    """Exact fingerprint — catches identical invoices."""
    canonical = canonicalize_invoice(invoice)
    return hashlib.sha256(canonical.encode()).hexdigest()


def get_minhash_signature(invoice: Dict[str, Any], num_perm: int = 128) -> MinHash:
    """Fuzzy fingerprint — catches invoices changed up to 20%."""
    canonical = canonicalize_invoice(invoice)
    m = MinHash(num_perm=num_perm)
    for word in canonical.split():
        m.update(word.encode('utf8'))
    return m


def get_semantic_embedding(invoice: Dict[str, Any]) -> list:
    """Semantic vector — catches meaning-level duplicates."""
    model = get_model()
    if model is None:
        # Fallback: return empty list if sentence-transformers not available
        return []
    items_text = " ".join(invoice.get("items", []))
    text = f"{invoice.get('supplier', '')} {invoice.get('buyer', '')} {items_text} {invoice.get('amount', '')}"
    return model.encode(text).tolist()


def compare_invoices_fuzzy(invoice1: Dict[str, Any], invoice2: Dict[str, Any], threshold: float = 0.8) -> bool:
    """Compare two invoices using MinHash similarity."""
    m1 = get_minhash_signature(invoice1)
    m2 = get_minhash_signature(invoice2)
    return m1.jaccard(m2) >= threshold
