"""Layer 1: Behavioral analysis for submission patterns."""
import time
from collections import deque
from typing import Dict, Any
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


def reset_behavioral_log():
    """Reset the submission log (for testing)."""
    global _submission_log
    _submission_log = SubmissionLog(maxlen=10000)
