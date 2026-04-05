"""Configuration for Invoice Physics backend."""
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Service availability flags (set based on Docker availability)
USE_REDIS = os.getenv('USE_REDIS', 'false').lower() == 'true'
USE_NEO4J = os.getenv('USE_NEO4J', 'false').lower() == 'true'
USE_OSRM = os.getenv('USE_OSRM', 'false').lower() == 'true'
USE_LLM = os.getenv('USE_LLM', 'false').lower() == 'true'

# Connection settings
REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')
REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
NEO4J_URI = os.getenv('NEO4J_URI', 'bolt://localhost:7687')
NEO4J_USER = os.getenv('NEO4J_USER', 'neo4j')
NEO4J_PASSWORD = os.getenv('NEO4J_PASSWORD', 'password')
OSRM_URL = os.getenv('OSRM_URL', 'http://localhost:5000')

# LLM settings
LLM_MODEL_PATH = os.getenv('LLM_MODEL_PATH', 'models/tinyllama/tinyllama-1.1b-chat.gguf')
