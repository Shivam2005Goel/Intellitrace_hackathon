import os
import redis
from neo4j import GraphDatabase
import json

def check_redis():
    print("\n--- Checking Redis Data ---")
    try:
        # These match the .env defaults or common docker-compose setups
        r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
        keys = r.keys("*")
        print(f"Total keys in Redis: {len(keys)}")
        if keys:
            print("Sample keys:")
            for k in keys[:10]:
                print(f" - {k}")
        else:
            print("No keys found in Redis.")
    except Exception as e:
        print(f"Error connecting to Redis: {e}")

def check_neo4j():
    print("\n--- Checking Neo4j Data ---")
    uri = "bolt://localhost:7687"
    user = "neo4j"
    password = "password"
    
    try:
        driver = GraphDatabase.driver(uri, auth=(user, password))
        with driver.session() as session:
            result = session.run("MATCH (n) RETURN labels(n) as label, count(n) as count")
            data = result.data()
            if data:
                print("Node counts by label:")
                for record in data:
                    print(f" - {record['label']}: {record['count']}")
            else:
                print("No nodes found in Neo4j.")
                
            # Check for a few relationships
            result = session.run("MATCH ()-[r]->() RETURN type(r) as type, count(r) as count")
            data = result.data()
            if data:
                print("Relationship counts by type:")
                for record in data:
                    print(f" - {record['type']}: {record['count']}")
    except Exception as e:
        print(f"Error connecting to Neo4j: {e}")
    finally:
        if 'driver' in locals():
            driver.close()

if __name__ == "__main__":
    check_redis()
    check_neo4j()
