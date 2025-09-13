#!/usr/bin/env python3
"""
Complete AHA Demo Script
1. Runs Zypher target system with LangSmith tracing
2. Simulates failures and webhook notifications
3. Shows AHA processing and diagnosis
"""
import subprocess
import requests
import time
import json
import os
import sys
from datetime import datetime

# Configuration
AHA_BACKEND = "http://localhost:8000"
AHA_FRONTEND = "http://localhost:3000"

def check_services():
    """Check if AHA services are running"""
    print("🔍 Checking AHA services...")
    
    # Check backend
    try:
        response = requests.get(f"{AHA_BACKEND}/", timeout=5)
        if response.status_code == 200:
            print("✅ AHA Backend is running")
        else:
            print("❌ AHA Backend not responding")
            return False
    except:
        print("❌ AHA Backend is not running")
        return False
    
    # Check frontend
    try:
        response = requests.get(f"{AHA_FRONTEND}/", timeout=5)
        if response.status_code == 200:
            print("✅ AHA Frontend is running")
        else:
            print("❌ AHA Frontend not responding")
            return False
    except:
        print("❌ AHA Frontend is not running")
        return False
    
    return True

def run_zypher_target(query: str):
    """Run the Zypher target system"""
    print(f"\n🎯 Running Zypher Target System...")
    print(f"📝 Query: {query}")
    print("=" * 50)
    
    try:
        result = subprocess.run([
            sys.executable, "test_zypher_with_langsmith.py", query
        ], capture_output=True, text=True, timeout=60)
        
        print("�� Zypher Output:")
        print(result.stdout)
        
        if result.stderr:
            print("⚠️  Zypher Errors:")
            print(result.stderr)
        
        return result.returncode == 0
        
    except subprocess.TimeoutExpired:
        print("⏰ Zypher timed out")
        return False
    except Exception as e:
        print(f"💥 Error running Zypher: {e}")
        return False

def simulate_webhook():
    """Simulate a LangSmith webhook to AHA"""
    print(f"\n📡 Simulating LangSmith webhook...")
    
    webhook_payload = {
        "trace_id": f"trace_{int(time.time())}",
        "run_id": f"run_{int(time.time())}",
        "project_name": "aha-demo",
        "status": "error",
        "error": {
            "type": "json_parsing_error",
            "message": "SynthesizerAgent failed to parse malformed JSON from ResearcherAgent"
        },
        "metadata": {
            "agent_name": "SynthesizerAgent",
            "timestamp": datetime.now().isoformat()
        }
    }
    
    try:
        response = requests.post(
            f"{AHA_BACKEND}/webhook/langsmith",
            json=webhook_payload,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            print("✅ Webhook sent successfully")
            print(f"   Response: {response.json()}")
            return True
        else:
            print(f"❌ Webhook failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Webhook error: {e}")
        return False

def check_incidents():
    """Check AHA incidents"""
    print(f"\n📊 Checking AHA incidents...")
    
    try:
        response = requests.get(f"{AHA_BACKEND}/api/incidents")
        if response.status_code == 200:
            incidents = response.json()
            print(f"Found {len(incidents)} incidents:")
            for incident in incidents:
                print(f"  - {incident.get('trace_id')}: {incident.get('diagnosis', 'Pending analysis')}")
            return incidents
        else:
            print(f"❌ Failed to fetch incidents: {response.status_code}")
            return []
    except Exception as e:
        print(f"❌ Error fetching incidents: {e}")
        return []

def main():
    print("🚀 Complete AHA Demo")
    print("=" * 60)
    
    # Check services
    if not check_services():
        print("\n❌ Please start AHA services first:")
        print("   Terminal 1: ./run_backend.sh")
        print("   Terminal 2: ./run_frontend.sh")
        return 1
    
    # Check environment
    required_vars = ["LANGSMITH_API_KEY", "ANTHROPIC_API_KEY"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print(f"\n⚠️  Missing environment variables: {missing_vars}")
        print("   The demo will work but without real LangSmith tracing")
    
    # Run Zypher target system
    query = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else "Find latest AI news and trends"
    zypher_success = run_zypher_target(query)
    
    # Simulate webhook (regardless of Zypher success)
    webhook_success = simulate_webhook()
    
    if webhook_success:
        print("\n⏳ Waiting for AHA to process incident...")
        time.sleep(5)
        
        # Check incidents
        incidents = check_incidents()
        
        if incidents:
            print(f"\n🎉 AHA Demo Complete!")
            print(f"🌐 View dashboard: {AHA_FRONTEND}")
            print(f"🔗 API docs: {AHA_BACKEND}/docs")
        else:
            print(f"\n⚠️  No incidents found")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
