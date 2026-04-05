"""Layer 3: Neo4j graph database for supply chain relationships."""
from typing import Dict, Any, List, Optional
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import USE_NEO4J, NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD

# In-memory graph fallback
_memory_nodes = {}
_memory_edges = []

# Try to import Neo4j
try:
    from neo4j import GraphDatabase
    NEO4J_AVAILABLE = True
except ImportError:
    NEO4J_AVAILABLE = False

class GraphBuilder:
    """Neo4j graph builder for supply chain fraud detection (with in-memory fallback)."""
    
    def __init__(self):
        self.driver = None
        self._use_memory = not USE_NEO4J or not NEO4J_AVAILABLE
        if USE_NEO4J and NEO4J_AVAILABLE:
            self._connect()
    
    def _connect(self):
        """Establish database connection."""
        try:
            self.driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
        except Exception as e:
            print(f"Neo4j connection failed, using in-memory: {e}")
            self.driver = None
            self._use_memory = True
    
    def close(self):
        """Close database connection."""
        if self.driver:
            self.driver.close()
    
    def is_connected(self) -> bool:
        """Check if database is connected."""
        if self._use_memory:
            return True  # In-memory always available
        if not self.driver:
            return False
        try:
            with self.driver.session() as session:
                session.run("RETURN 1")
            return True
        except Exception:
            return False
    
    def add_invoice_to_graph(self, invoice: Dict[str, Any]) -> bool:
        """Add invoice relationship to graph (Neo4j or in-memory)."""
        if self._use_memory:
            # In-memory storage
            global _memory_nodes, _memory_edges
            supplier_id = invoice.get("supplier_id")
            buyer_id = invoice.get("buyer_id") or invoice.get("buyer")
            _memory_nodes[supplier_id] = {"type": "Company", "name": invoice.get("supplier")}
            _memory_nodes[buyer_id] = {"type": "Company", "name": invoice.get("buyer")}
            _memory_edges.append((supplier_id, buyer_id))
            return True
        
        if not self.driver:
            return False
        
        try:
            with self.driver.session() as session:
                session.run("""
                    MERGE (supplier:Company {id: $supplier_id})
                    ON CREATE SET supplier.name = $supplier_name
                    ON MATCH SET supplier.last_seen = datetime()
                """, supplier_id=invoice.get("supplier_id"), supplier_name=invoice.get("supplier"))
                
                session.run("""
                    MERGE (buyer:Company {id: $buyer_id})
                    ON CREATE SET buyer.name = $buyer_name
                """, buyer_id=invoice.get("buyer_id") or invoice.get("buyer"), buyer_name=invoice.get("buyer"))
                
                session.run("""
                    MATCH (s:Company {id: $supplier_id})
                    MATCH (b:Company {id: $buyer_id})
                    CREATE (s)-[:SUPPLIES {amount: $amount}]->(b)
                """, supplier_id=invoice.get("supplier_id"), buyer_id=invoice.get("buyer_id") or invoice.get("buyer"), amount=invoice.get("amount", 0))
            return True
        except Exception as e:
            print(f"Error adding invoice: {e}")
            return False
    
    def _calculate_tier(self, amount: float) -> str:
        """Calculate transaction tier based on amount."""
        if amount >= 1000000:
            return "enterprise"
        elif amount >= 100000:
            return "corporate"
        elif amount >= 10000:
            return "sme"
        return "small"
    
    def get_supply_chain_graph(self, root_company: str, depth: int = 3) -> List[Dict]:
        """Get supply chain graph for visualization."""
        if not self.is_connected():
            return []
        
        try:
            with self.driver.session() as session:
                result = session.run("""
                    MATCH path = (c:Company {id: $root})-[:SUPPLIES|ISSUED|BILLED_TO*1..%d]-(n)
                    RETURN path 
                    LIMIT 200
                """ % (depth * 2),
                    root=root_company
                )
                return result.data()
        except Exception as e:
            print(f"Error querying graph: {e}")
            return []
    
    def get_company_network(self, company_id: str) -> Dict[str, Any]:
        """Get full network info for a company."""
        if not self.is_connected():
            return {}
        
        try:
            with self.driver.session() as session:
                # Get suppliers (companies that bill to this company)
                suppliers_result = session.run("""
                    MATCH (s:Company)-[:ISSUED]->(:Invoice)-[:BILLED_TO]->(c:Company {id: $company_id})
                    RETURN DISTINCT s.id as id, s.name as name
                """, company_id=company_id)
                suppliers = [{"id": r["id"], "name": r["name"]} for r in suppliers_result]
                
                # Get customers (companies this company bills)
                customers_result = session.run("""
                    MATCH (:Company {id: $company_id})-[:ISSUED]->(:Invoice)-[:BILLED_TO]->(c:Company)
                    RETURN DISTINCT c.id as id, c.name as name
                """, company_id=company_id)
                customers = [{"id": r["id"], "name": r["name"]} for r in customers_result]
                
                # Get transaction volume
                volume_result = session.run("""
                    MATCH (:Company {id: $company_id})-[:ISSUED]->(i:Invoice)
                    RETURN sum(i.amount) as total_issued, count(i) as invoice_count
                """, company_id=company_id)
                volume_record = volume_result.single()
                
                return {
                    "company_id": company_id,
                    "suppliers": suppliers,
                    "customers": customers,
                    "supplier_count": len(suppliers),
                    "customer_count": len(customers),
                    "total_volume": volume_record["total_issued"] if volume_record else 0,
                    "invoice_count": volume_record["invoice_count"] if volume_record else 0
                }
        except Exception as e:
            print(f"Error getting company network: {e}")
            return {}
    
    def get_all_edges(self) -> List[tuple]:
        """Get all edges for cycle detection."""
        if self._use_memory:
            global _memory_edges
            return _memory_edges
        
        if not self.driver:
            return []
        
        try:
            with self.driver.session() as session:
                result = session.run("MATCH (a:Company)-[:SUPPLIES]->(b:Company) RETURN a.id as source, b.id as target")
                return [(r["source"], r["target"]) for r in result]
        except Exception as e:
            print(f"Error getting edges: {e}")
            return []

# Global instance
_graph_builder = None

def get_graph_builder() -> GraphBuilder:
    """Get or create graph builder instance."""
    global _graph_builder
    if _graph_builder is None:
        _graph_builder = GraphBuilder()
    return _graph_builder
