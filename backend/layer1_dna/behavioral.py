"""Layer 1: Behavioral analysis for submission patterns."""
import time
from collections import deque
from typing import Dict, Any
import threading
import numpy as np
import math
import threading

# Thread-safe submission log
class SubmissionLog:
    def __init__(self, maxlen: int = 10000):
        self._log = deque(maxlen=maxlen)
        self._lock = threading.Lock()
    
    def append(self, item: Dict[str, Any]):
        with self._lock:
            self._log.append(item)
    
    def get_recent(self, supplier_id: str, window_seconds: float, current_time: float) -> list:
        with self._lock:
            return [
                t for t in self._log 
                if t.get("supplier") == supplier_id 
                and current_time - t.get("time", 0) < window_seconds
            ]
    
    def get_stats(self, supplier_id: str, window_seconds: float, current_time: float) -> Dict[str, Any]:
        with self._lock:
            recent = [
                t for t in self._log 
                if t.get("supplier") == supplier_id 
                and current_time - t.get("time", 0) < window_seconds
            ]
            
            # Also check last 24 hours
            day_recent = [
                t for t in self._log 
                if t.get("supplier") == supplier_id 
                and current_time - t.get("time", 0) < 86400
            ]
            
            return {
                "recent_count": len(recent),
                "daily_count": len(day_recent),
                "total_in_log": len(self._log)
            }

# Global submission log instance
_submission_log = SubmissionLog(maxlen=10000)


def score_submission_behavior(supplier_id: str, submission_time: float = None) -> Dict[str, Any]:
    """Detect rapid-fire invoice submissions and anomalous patterns."""
    if submission_time is None:
        submission_time = time.time()
    
    # Get recent submissions (1 hour window)
    recent = _submission_log.get_recent(supplier_id, 3600, submission_time)
    stats = _submission_log.get_stats(supplier_id, 3600, submission_time)
    
    # Log this submission
    _submission_log.append({
        "supplier": supplier_id, 
        "time": submission_time
    })
    
    count = len(recent)
    daily_count = stats["daily_count"]
    
    # Calculate anomaly score based on submission frequency
    hour_score = min(count / 10.0, 1.0)  # Normalize 0-1 (10+ per hour = max)
    day_score = min(daily_count / 50.0, 1.0)  # 50+ per day = max
    
    # Combined score weighted more heavily on hourly bursts
    anomaly_score = round((hour_score * 0.7 + day_score * 0.3), 2)
    
    return {
        "submissions_last_hour": count,
        "submissions_last_24h": daily_count,
        "anomaly_score": anomaly_score,
        "flagged": count > 10 or daily_count > 50 or anomaly_score > 0.7,
        "hourly_rate": count,
        "daily_rate": daily_count
    }


def get_supplier_velocity(supplier_id: str) -> Dict[str, Any]:
    """Get historical submission velocity for a supplier."""
    current_time = time.time()
    stats = _submission_log.get_stats(supplier_id, 86400, current_time)
    
    return {
        "supplier_id": supplier_id,
        "daily_submissions": stats["daily_count"],
        "velocity_tier": "high" if stats["daily_count"] > 50 else "medium" if stats["daily_count"] > 10 else "low"
    }


# Feature 8: Trust-Decay 
_company_trust = {}

def score_trust_decay(supplier_id: str, current_anomaly_score: float) -> Dict[str, Any]:
    """Detect emerging risk based on reputation decay."""
    global _company_trust
    data = _company_trust.setdefault(supplier_id, {
        "clean_count": 10, 
        "flagged_count": 0, 
        "trust_score": 1.0, 
        "last_updated": time.time()
    })
    
    # Simple trust score calc (historical)
    total = data["clean_count"] + data["flagged_count"]
    if total > 0:
        data["trust_score"] = data["clean_count"] / total
        
    # Time decay
    days_elapsed = (time.time() - data["last_updated"]) / 86400
    if days_elapsed > 0:
        data["trust_score"] *= (0.95 ** (days_elapsed / 30))  # 5% decay per month
    
    data["last_updated"] = time.time()
    
    # Calculate emerging risk
    # If historical trust is high but current anomaly is high, risk is huge
    emerging_risk = max(0, current_anomaly_score - data["trust_score"])
    
    return {
        "trust_score": round(data["trust_score"], 2),
        "emerging_risk": round(emerging_risk, 2),
        "trust_trend": "decreasing" if emerging_risk > 0.4 else "stable"
    }


# Feature 3: Funding-Frequency Resonance
def score_resonance(supplier_id: str) -> Dict[str, Any]:
    """Detect periodic submission rhythms (e.g. every 7/14/30 days)."""
    with _submission_log._lock:
        times = sorted([t.get("time", 0) for t in _submission_log._log if t.get("supplier") == supplier_id])
    
    if len(times) < 3:
        return {"resonance_score": 0, "flagged": False, "dominant_period_days": None}
        
    intervals_days = [(times[i] - times[i-1])/86400 for i in range(1, len(times))]
    
    # In a real engine, we use np.fft but for small arrays simple peak checking works well
    # Try to find consistent periodicity around 7, 14, 30
    flagged = False
    score = 0
    dominant_period = sum(intervals_days) / len(intervals_days) if intervals_days else 0
    
    for period in [7, 14, 30]:
        # If > 50% of intervals match a banking rhythm
        matches = sum(1 for td in intervals_days if math.isclose(td, period, abs_tol=1.0) or (td > 0 and period % td == 0))
        if matches > len(intervals_days) * 0.4:
            score += 8
            flagged = True
            dominant_period = period
            break
            
    return {
        "resonance_score": min(score, 10),
        "dominant_period_days": round(dominant_period, 1),
        "flagged": flagged
    }


def reset_behavioral_log():
    """Reset the submission log (for testing)."""
    global _submission_log
    _submission_log = SubmissionLog(maxlen=10000)
