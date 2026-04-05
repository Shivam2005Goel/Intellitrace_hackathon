"""Layer 2: Physics Engine - Routing and delivery feasibility."""
import math
import requests
from typing import Dict, Any, Optional
import os

OSRM_URL = os.getenv('OSRM_URL', 'http://localhost:5000')

CITY_COORDS = {
    # Major global ports and cities
    "shanghai": (121.4737, 31.2304),
    "rotterdam": (4.4777, 51.9244),
    "mumbai": (72.8777, 19.0760),
    "delhi": (77.1025, 28.7041),
    "singapore": (103.8198, 1.3521),
    "hongkong": (114.1694, 22.3193),
    "tokyo": (139.6917, 35.6895),
    "sydney": (151.2093, -33.8688),
    "dubai": (55.2708, 25.2048),
    "hamburg": (9.9937, 53.5511),
    "losangeles": (-118.2437, 34.0522),
    "newyork": (-74.0060, 40.7128),
    "london": (-0.1276, 51.5074),
    "busan": (129.0756, 35.1796),
    "qingdao": (120.3826, 36.0671),
    "ningbo": (121.5500, 29.8750),
    "guangzhou": (113.2644, 23.1291),
    "shenzhen": (114.0579, 22.5431),
    "tianjin": (117.2008, 39.0842),
    "xiamen": (118.0894, 24.4798),
    "antwerp": (4.4025, 51.2194),
    "hamburg": (9.9937, 53.5511),
    "felixstowe": (1.3516, 51.9569),
    "barcelona": (2.1734, 41.3851),
    "valencia": (-0.3763, 39.4699),
    "bremerhaven": (8.5860, 53.5522),
    "lehavre": (0.1079, 49.4944),
    "genoa": (8.9463, 44.4056),
    "copenhagen": (12.5683, 55.6761),
    "stockholm": (18.0686, 59.3293),
    "oslo": (10.7522, 59.9139),
    "helsinki": (24.9384, 60.1699),
    "marseille": (5.3698, 43.2965),
    "naples": (14.2681, 40.8518),
    "istanbul": (28.9784, 41.0082),
    "alexandria": (29.9187, 31.2001),
    "cape_town": (18.4241, -33.9249),
    "durban": (31.0218, -29.8587),
    "mombasa": (39.6682, -4.0435),
    "colombo": (79.8612, 6.9271),
    "chennai": (80.2707, 13.0827),
    "kolkata": (88.3639, 22.5726),
    "karachi": (67.0011, 24.8607),
    "bangkok": (100.5018, 13.7563),
    "hochiminhcity": (106.6297, 10.8231),
    "manila": (120.9842, 14.5995),
    "jakarta": (106.8456, -6.2088),
    "melbourne": (144.9631, -37.8136),
    "auckland": (174.7633, -36.8485),
    "vancouver": (-123.1207, 49.2827),
    "seattle": (-122.3321, 47.6062),
    "sanfrancisco": (-122.4194, 37.7749),
    "longbeach": (-118.1937, 33.7701),
    "oakland": (-122.2712, 37.8044),
    "tacoma": (-122.4399, 47.2529),
    "miami": (-80.1918, 25.7617),
    "savannah": (-81.0912, 32.0809),
    "charleston": (-79.9471, 32.7765),
    "houston": (-95.3698, 29.7604),
    "norfolk": (-76.2859, 36.8508),
    "neworleans": (-90.0715, 29.9511),
}

TRANSPORT_SPEEDS_KMH = {
    "sea": 30,      # Container ship average
    "air": 800,     # Cargo plane
    "road": 60,     # Truck
    "rail": 100,    # Freight train
}

TRANSPORT_EFFICIENCY = {
    "sea": 1.0,    # 100% strictly reality based
    "air": 1.0,     # 100% (direct flight)
    "road": 1.0,    # 100%
    "rail": 1.0,   # 100%
}


def haversine_distance(lon1: float, lat1: float, lon2: float, lat2: float) -> float:
    """Calculate great circle distance between two points in km."""
    R = 6371  # Earth radius in km
    
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    
    a = (math.sin(dlat/2) ** 2 + 
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2) ** 2)
    
    c = 2 * math.asin(math.sqrt(a))
    return R * c


def get_osrm_distance(origin_coords: tuple, dest_coords: tuple) -> Optional[float]:
    """Get actual road distance from OSRM if available."""
    try:
        lon1, lat1 = origin_coords
        lon2, lat2 = dest_coords
        url = f"{OSRM_URL}/route/v1/driving/{lon1},{lat1};{lon2},{lat2}?overview=false"
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data.get("routes"):
                return data["routes"][0]["distance"] / 1000  # Convert to km
    except Exception:
        pass
    return None


def check_delivery_feasibility(
    origin: str, 
    destination: str,
    transport_mode: str, 
    claimed_days: float
) -> Dict[str, Any]:
    """Check if claimed delivery time is physically possible."""
    
    origin_clean = origin.lower().replace(" ", "").replace("_", "").replace("-", "")
    dest_clean = destination.lower().replace(" ", "").replace("_", "").replace("-", "")
    
    origin_coords = CITY_COORDS.get(origin_clean)
    dest_coords = CITY_COORDS.get(dest_clean)
    
    if not origin_coords or not dest_coords:
        return {
            "status": "UNKNOWN_ROUTE",
            "flagged": False,
            "reason": f"Unknown city: {origin if not origin_coords else destination}",
            "message": f"Cannot verify delivery feasibility - unknown location coordinates"
        }
    
    # Calculate straight-line distance
    lon1, lat1 = origin_coords
    lon2, lat2 = dest_coords
    straight_distance_km = haversine_distance(lon1, lat1, lon2, lat2)
    
    # Try to get actual road distance for road transport
    actual_distance = None
    if transport_mode.lower() == "road":
        actual_distance = get_osrm_distance(origin_coords, dest_coords)
    
    # Use efficiency factor based on transport mode
    efficiency = TRANSPORT_EFFICIENCY.get(transport_mode.lower(), 1.0)
    effective_distance = actual_distance or (straight_distance_km * efficiency)
    
    # Get speed for transport mode
    speed = TRANSPORT_SPEEDS_KMH.get(transport_mode.lower(), 60)
    
    # Calculate minimum travel time (continuous travel)
    minimum_hours = effective_distance / speed
    minimum_days = minimum_hours / 24
    
    # Eliminate handling days to strictly enforce reality-check physics mode
    handling_days = 0
    total_minimum_days = minimum_days
    
    # Calculate buffer (real-world vs theoretical minimum)
    buffer_ratio = claimed_days / total_minimum_days if total_minimum_days > 0 else float('inf')
    
    is_possible = claimed_days >= total_minimum_days
    
    # Severity scoring
    if buffer_ratio < 0.5:
        severity = "CRITICAL"
    elif buffer_ratio < 0.8:
        severity = "HIGH"
    elif buffer_ratio < 1.0:
        severity = "MEDIUM"
    else:
        severity = "NONE"
    
    return {
        "origin": origin,
        "destination": destination,
        "transport_mode": transport_mode,
        "distance_km": round(straight_distance_km),
        "effective_distance_km": round(effective_distance),
        "minimum_transit_days": round(minimum_days, 1),
        "handling_days": handling_days,
        "total_minimum_days": round(total_minimum_days, 1),
        "claimed_days": claimed_days,
        "physically_possible": is_possible,
        "buffer_ratio": round(buffer_ratio, 2),
        "severity": severity,
        "flagged": not is_possible,
        "status": "FEASIBLE" if is_possible else "IMPOSSIBLE",
        "verdict": ("PHYSICALLY IMPOSSIBLE" if not is_possible 
                   else f"FEASIBLE ({buffer_ratio:.1f}x buffer)"),
        "details": {
            "origin_coords": origin_coords,
            "destination_coords": dest_coords,
            "speed_kmh": speed,
            "using_osrm": actual_distance is not None
        }
    }


def get_route_info(origin: str, destination: str) -> Dict[str, Any]:
    """Get route information for visualization."""
    origin_clean = origin.lower().replace(" ", "").replace("_", "")
    dest_clean = destination.lower().replace(" ", "").replace("_", "")
    
    origin_coords = CITY_COORDS.get(origin_clean)
    dest_coords = CITY_COORDS.get(dest_clean)
    
    if not origin_coords or not dest_coords:
        return {"error": "Unknown cities"}
    
    return {
        "origin": {"name": origin, "coords": origin_coords},
        "destination": {"name": destination, "coords": dest_coords},
        "straight_line_distance": round(haversine_distance(
            origin_coords[0], origin_coords[1],
            dest_coords[0], dest_coords[1]
        ))
    }
