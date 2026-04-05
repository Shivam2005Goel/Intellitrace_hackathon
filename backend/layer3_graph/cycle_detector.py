"""Layer 3: Fraud ring detection using cycle detection and community analysis."""
import networkx as nx
from typing import Dict, Any, List, Tuple

try:
    import community as community_louvain
    COMMUNITY_AVAILABLE = True
except ImportError:
    COMMUNITY_AVAILABLE = False


def detect_fraud_rings(edges: List[Tuple[str, str]], max_cycle_length: int = 6) -> Dict[str, Any]:
    """
    Detect fraud rings using DFS cycle detection on obligation graph.
    A fraud ring is a closed loop of companies trading with each other.
    """
    if not edges:
        return {
            "cycles_found": 0,
            "fraud_rings": [],
            "flagged": False,
            "severity": "NONE",
            "verdict": "NO DATA - NO CYCLES"
        }
    
    # Build directed graph
    G = nx.DiGraph()
    G.add_edges_from(edges)
    
    # Find all simple cycles (fraud rings)
    cycles = []
    try:
        for cycle in nx.simple_cycles(G):
            if len(cycle) <= max_cycle_length:
                cycles.append(cycle)
            if len(cycles) >= 100:  # Limit to prevent performance issues
                break
    except Exception as e:
        return {
            "cycles_found": 0,
            "fraud_rings": [],
            "flagged": False,
            "error": str(e),
            "verdict": "ERROR IN CYCLE DETECTION"
        }
    
    # Analyze cycle patterns
    cycle_lengths = [len(c) for c in cycles]
    unique_companies = set()
    for cycle in cycles:
        unique_companies.update(cycle)
    
    # Calculate risk score based on cycle characteristics
    risk_score = 0
    if cycles:
        # More cycles = higher risk
        risk_score += min(len(cycles) * 2, 10)
        # Larger cycles = higher risk
        risk_score += sum(min(l - 2, 3) for l in cycle_lengths)
        # Multiple companies involved = higher risk
        risk_score += min(len(unique_companies) / 2, 5)
    
    # Determine severity
    if risk_score >= 15:
        severity = "CRITICAL"
    elif risk_score >= 10:
        severity = "HIGH"
    elif risk_score >= 5:
        severity = "MEDIUM"
    elif cycles:
        severity = "LOW"
    else:
        severity = "NONE"
    
    return {
        "cycles_found": len(cycles),
        "fraud_rings": cycles[:10],  # Return first 10 for display
        "cycle_lengths": cycle_lengths[:10],
        "companies_involved": len(unique_companies),
        "risk_score": risk_score,
        "severity": severity,
        "flagged": len(cycles) > 0,
        "verdict": (f"FRAUD RING DETECTED — {len(cycles)} CYCLES, {len(unique_companies)} COMPANIES" 
                   if cycles else "NO CYCLES DETECTED")
    }


def detect_communities(edges: List[Tuple[str, str]], weighted: bool = False) -> Dict[str, Any]:
    """
    Louvain community detection — finds tightly connected fraud clusters.
    """
    if not edges or not COMMUNITY_AVAILABLE:
        return {
            "communities": {},
            "modularity": 0,
            "num_communities": 0,
            "flagged": False
        }
    
    # Build undirected graph for community detection
    G = nx.Graph()
    if weighted:
        edge_counts = {}
        for edge in edges:
            key = tuple(sorted(edge))
            edge_counts[key] = edge_counts.get(key, 0) + 1
        for (u, v), weight in edge_counts.items():
            G.add_edge(u, v, weight=weight)
    else:
        G.add_edges_from(edges)
    
    # Run Louvain algorithm
    try:
        partition = community_louvain.best_partition(G)
        modularity = community_louvain.modularity(partition, G)
        
        # Group by community
        communities = {}
        for node, comm_id in partition.items():
            if comm_id not in communities:
                communities[comm_id] = []
            communities[comm_id].append(node)
        
        # Calculate statistics
        community_sizes = [len(nodes) for nodes in communities.values()]
        suspicious_communities = [c for c, nodes in communities.items() if len(nodes) >= 3]
        
        return {
            "communities": communities,
            "num_communities": len(communities),
            "community_sizes": community_sizes,
            "modularity": round(modularity, 3),
            "suspicious_communities": suspicious_communities,
            "suspicious_community_count": len(suspicious_communities),
            "flagged": len(suspicious_communities) > 0 and modularity > 0.3,
            "verdict": (f"{len(suspicious_communities)} SUSPICIOUS CLUSTERS DETECTED" 
                       if suspicious_communities else "NO SUSPICIOUS CLUSTERS")
        }
    except Exception as e:
        return {
            "communities": {},
            "modularity": 0,
            "num_communities": 0,
            "flagged": False,
            "error": str(e)
        }


def calculate_centrality_scores(edges: List[Tuple[str, str]]) -> Dict[str, Any]:
    """Calculate network centrality metrics for companies."""
    if not edges:
        return {}
    
    G = nx.DiGraph()
    G.add_edges_from(edges)
    
    try:
        # PageRank - identifies influential nodes
        pagerank = nx.pagerank(G)
        
        # Betweenness - identifies brokers
        betweenness = nx.betweenness_centrality(G)
        
        # In-degree and out-degree
        in_degree = dict(G.in_degree())
        out_degree = dict(G.out_degree())
        
        # Combine metrics
        scores = {}
        for node in G.nodes():
            scores[node] = {
                "pagerank": round(pagerank.get(node, 0), 4),
                "betweenness": round(betweenness.get(node, 0), 4),
                "in_degree": in_degree.get(node, 0),
                "out_degree": out_degree.get(node, 0),
                "hub_score": round(
                    pagerank.get(node, 0) * 0.4 + 
                    betweenness.get(node, 0) * 0.3 +
                    (in_degree.get(node, 0) + out_degree.get(node, 0)) / 100 * 0.3, 
                    4
                )
            }
        
        # Sort by hub score
        top_hubs = sorted(scores.items(), key=lambda x: x[1]["hub_score"], reverse=True)[:10]
        
        return {
            "centrality_scores": scores,
            "top_hubs": [{"node": n, **s} for n, s in top_hubs]
        }
    except Exception as e:
        return {"error": str(e)}


def analyze_triangle_patterns(edges: List[Tuple[str, str]]) -> Dict[str, Any]:
    """Detect triangular trading patterns (A->B, B->C, C->A)."""
    if not edges:
        return {"triangles": [], "count": 0}
    
    G = nx.DiGraph()
    G.add_edges_from(edges)
    
    # Find all directed triangles
    triangles = []
    nodes = list(G.nodes())
    
    for i, a in enumerate(nodes):
        for j, b in enumerate(nodes[i+1:], i+1):
            for c in nodes[j+1:]:
                # Check all permutations for directed 3-cycles
                edges_ab = G.has_edge(a, b)
                edges_bc = G.has_edge(b, c)
                edges_ca = G.has_edge(c, a)
                
                if edges_ab and edges_bc and edges_ca:
                    triangles.append([a, b, c])
                
                # Reverse direction
                edges_ba = G.has_edge(b, a)
                edges_cb = G.has_edge(c, b)
                edges_ac = G.has_edge(a, c)
                
                if edges_ba and edges_cb and edges_ac and [b, c, a] not in triangles:
                    triangles.append([b, c, a])
    
    return {
        "triangles": triangles,
        "count": len(triangles),
        "flagged": len(triangles) > 0,
        "severity": "HIGH" if len(triangles) > 5 else "MEDIUM" if len(triangles) > 0 else "NONE"
    }
