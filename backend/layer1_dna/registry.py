"""Layer 1: Cross-lender fingerprint registry using Redis (with in-memory fallback)."""
import redis
import json
from datasketch import MinHashLSH, MinHash
from typing import Dict, Any, Optional, List
import os
import sys

# Add parent to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import USE_REDIS, REDIS_HOST, REDIS_PORT

# In-memory fallback storage
_memory_registry = {}
_memory_lsh_map = {}

# Global LSH index for fuzzy matching
_lsh_index = None

def get_redis_client():
    """Get Redis client connection (or None if not available)."""
    if not USE_REDIS:
        return None
    try:
        r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True, socket_connect_timeout=2)
        r.ping()
        return r
    except Exception:
        return None

def get_lsh_index(threshold: float = 0.8, num_perm: int = 128):
    """Get or create MinHash LSH index."""
    global _lsh_index
    if _lsh_index is None:
        _lsh_index = MinHashLSH(threshold=threshold, num_perm=num_perm)
    return _lsh_index


def register_invoice(invoice_id: str, sha256: str, minhash: MinHash) -> Dict[str, Any]:
    """Store fingerprint in cross-lender registry (Redis or in-memory)."""
    r = get_redis_client()
    
    # Check exact duplicate
    if r:
        existing = r.get(f"sha256:{sha256}")
        if existing:
            return {"status": "DUPLICATE", "original_id": existing, "flagged": True}
    else:
        if sha256 in _memory_registry:
            return {"status": "DUPLICATE", "original_id": _memory_registry[sha256], "flagged": True}
    
    # Check fuzzy duplicate
    lsh = get_lsh_index()
    try:
        similar = lsh.query(minhash)
        if similar:
            return {"status": "FUZZY_MATCH", "similar_ids": similar, "flagged": True}
    except Exception:
        pass
    
    # Register new invoice
    if r:
        r.set(f"sha256:{sha256}", invoice_id, ex=86400 * 90)
        r.hset(f"invoice:{invoice_id}", mapping={"sha256": sha256, "registered_at": json.dumps(str(__import__('datetime').datetime.utcnow()))})
    else:
        _memory_registry[sha256] = invoice_id
    
    lsh.insert(invoice_id, minhash)
    
    return {"status": "NEW", "invoice_id": invoice_id, "flagged": False}


def get_invoice_by_fingerprint(sha256: str) -> Optional[str]:
    """Get invoice ID by SHA256 fingerprint."""
    r = get_redis_client()
    return r.get(f"sha256:{sha256}")


def get_similar_invoices(minhash: MinHash, threshold: float = 0.8) -> List[str]:
    """Get similar invoice IDs using fuzzy matching."""
    lsh = get_lsh_index(threshold=threshold)
    try:
        return lsh.query(minhash)
    except Exception:
        return []


def delete_invoice(invoice_id: str, sha256: str) -> bool:
    """Remove invoice from registry."""
    r = get_redis_client()
    r.delete(f"sha256:{sha256}")
    r.delete(f"invoice:{invoice_id}")
    return True
