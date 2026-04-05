#!/usr/bin/env python3
"""Start the Invoice Physics API server."""
import sys
import os
import subprocess
import time

def main():
    os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend'))
    print("=" * 60)
    print("Starting Invoice Physics API Server...")
    print("=" * 60)
    print("URL: http://localhost:8000")
    print("Docs: http://localhost:8000/docs")
    print("Health: http://localhost:8000/health")
    print("=" * 60)
    
    try:
        subprocess.run([
            sys.executable, '-m', 'uvicorn', 
            'main:app', 
            '--host', '0.0.0.0', 
            '--port', '8000',
            '--log-level', 'info'
        ])
    except KeyboardInterrupt:
        print("\nServer stopped.")

if __name__ == '__main__':
    main()
