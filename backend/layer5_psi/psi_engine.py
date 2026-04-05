"""Layer 5: PSI - Cross-lender fraud detection (with in-memory fallback)."""
import hashlib
import hmac
import os
import sys
from typing import Dict, Any, List, Optional, Set

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import USE_REDIS, REDIS_HOST, REDIS_PORT

# In-memory PSI storage
_psi_registry = {}  # fingerprint -> set of lenders

# Try to import Redis
try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False

# PSI namespace prefix
PSI_PREFIX = "psi:v1"


def get_redis_client():
    """Get Redis client connection (or None if not available)."""
    if not USE_REDIS or not REDIS_AVAILABLE:
        return None
    try:
        r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True, socket_connect_timeout=2)
        r.ping()
        return r
    except Exception:
        return None


def hash_fingerprint(fingerprint: str, salt: str = "invoice-physics") -> str:
    """
    Create a secure hash of the fingerprint.
    Uses HMAC to prevent rainbow table attacks on known invoice patterns.
    """
    key = salt.encode('utf-8')
    message = fingerprint.encode('utf-8')
    return hmac.new(key, message, hashlib.sha256).hexdigest()


def submit_to_psi_registry(lender_id: str, invoice_fingerprints: List[str], use_hashing: bool = True) -> Dict[str, Any]:
    """Submit fingerprints to PSI registry (Redis or in-memory)."""
    r = get_redis_client()
    submitted_count = 0
    new_matches = 0
    global _psi_registry
    
    for fp in invoice_fingerprints:
        lookup_key = hash_fingerprint(fp, salt="global") if use_hashing else fp
        
        if r:
            key = f"{PSI_PREFIX}:{lookup_key}"
            was_added = r.sadd(key, lender_id)
            r.expire(key, 86400 * 90)
            if was_added == 0 and r.scard(key) > 1:
                new_matches += 1
        else:
            # In-memory storage
            if lookup_key not in _psi_registry:
                _psi_registry[lookup_key] = set()
            if lender_id not in _psi_registry[lookup_key]:
                _psi_registry[lookup_key].add(lender_id)
            else:
                if len(_psi_registry[lookup_key]) > 1:
                    new_matches += 1
        
        submitted_count += 1
    
    return {"submitted": submitted_count, "new_cross_matches": new_matches, "status": "success"}


def detect_cross_lender_rings(invoice_fingerprint: str, requesting_lender: Optional[str] = None) -> Dict[str, Any]:
    """Check if invoice appeared at multiple lenders (PSI)."""
    r = get_redis_client()
    global _psi_registry
    
    lookup_key = hash_fingerprint(invoice_fingerprint, salt="global")
    
    if r:
        key = f"{PSI_PREFIX}:{lookup_key}"
        lenders = r.smembers(key)
        lenders_list = sorted(list(lenders))
    else:
        lenders_list = sorted(list(_psi_registry.get(lookup_key, set())))
    
    other_lenders = [l for l in lenders_list if l != requesting_lender] if requesting_lender else lenders_list
    other_count = len(other_lenders)
    
    # Risk level
    if other_count >= 3:
        risk_level, severity_score = "CRITICAL", 10
    elif other_count == 2:
        risk_level, severity_score = "HIGH", 7
    elif other_count == 1:
        risk_level, severity_score = "MEDIUM", 4
    else:
        risk_level, severity_score = "NONE", 0
    
    return {
        "lenders_affected": lenders_list,
        "other_lenders": other_lenders,
        "count": len(lenders_list),
        "other_count": other_count,
        "requesting_lender": requesting_lender,
        "risk_level": risk_level,
        "severity_score": severity_score,
        "flagged": other_count > 0,
        "status": "MULTI_LENDER" if other_count > 0 else "SINGLE_LENDER",
        "verdict": f"CROSS-LENDER FRAUD: Seen at {len(lenders_list)} institutions" if other_count > 0 else "NO CROSS-LENDER ACTIVITY",
        "privacy_note": "Only fingerprint hashes compared - no invoice data shared"
    }


def get_lender_statistics(lender_id: str) -> Dict[str, Any]:
    """Get statistics for a specific lender."""
    r = get_redis_client()
    
    # Count unique fingerprints for this lender
    pattern = f"{PSI_PREFIX}:lender:{lender_id}:*"
    keys = list(r.scan_iter(match=pattern))
    total_submissions = len(keys)
    
    # Find how many are shared with other lenders
    cross_lender_count = 0
    for key in keys[:1000]:  # Sample for performance
        # Extract fingerprint hash from key
        fp_hash = key.split(":")[-1]
        global_key = f"{PSI_PREFIX}:{fp_hash}"
        lender_count = r.scard(global_key)
        if lender_count > 1:
            cross_lender_count += 1
    
    return {
        "lender_id": lender_id,
        "total_submissions": total_submissions,
        "cross_lender_matches": cross_lender_count,
        "unique_rate": round((1 - cross_lender_count / max(total_submissions, 1)) * 100, 2)
    }


def find_common_fingerprints(lender_ids: List[str]) -> Dict[str, Any]:
    """
    Find fingerprints shared between multiple lenders.
    Used for consortium fraud analysis.
    """
    r = get_redis_client()
    
    if len(lender_ids) < 2:
        return {"error": "Need at least 2 lenders"}
    
    # This is a simplified version - full PSI protocols would use
    # cryptographic techniques like Diffie-Hellman or OT-extension
    
    # Get all keys for first lender
    pattern = f"{PSI_PREFIX}:lender:{lender_ids[0]}:*"
    keys = list(r.scan_iter(match=pattern))
    
    common = []
    for key in keys:
        fp_hash = key.split(":")[-1]
        global_key = f"{PSI_PREFIX}:{fp_hash}"
        lenders = r.smembers(global_key)
        
        # Check if all requested lenders are in the set
        if all(l in lenders for l in lender_ids):
            common.append(fp_hash[:16] + "...")  # Truncated for privacy
    
    return {
        "lenders": lender_ids,
        "common_fingerprints": len(common),
        "sample_hashes": common[:5],  # Sample only
        "privacy_note": "Full hashes not revealed - only count provided"
    }


def clear_psi_data(lender_id: Optional[str] = None) -> bool:
    """Clear PSI data (for testing/maintenance)."""
    r = get_redis_client()
    
    if lender_id:
        # Clear only this lender's data
        pattern = f"{PSI_PREFIX}:lender:{lender_id}:*"
        keys = list(r.scan_iter(match=pattern))
        for key in keys:
            r.delete(key)
    else:
        # Clear all PSI data
        pattern = f"{PSI_PREFIX}:*"
        keys = list(r.scan_iter(match=pattern))
        for key in keys:
            r.delete(key)
    
    return True
