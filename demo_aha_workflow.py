#!/usr/bin/env python3
"""
Demo script that simulates the complete AHA workflow
"""
import requests
import json
import time
import random

# AHA Backend URL
AHA_BACKEND = "http://localhost:8000"

def simulate_langsmith_webhook():
    """Simulate a LangSmith webhook payload"""
    webhook_payload = {
        "trace_id": f"trace_{random.randint(1000, 9999)}",
        "run_id": f"run_{random.randint(1000, 9999)}",
        "project_name": "aha-demo",
        "status": "error",
        "error": {
            "type": "json_parsing_error",
            "message": "SynthesizerAgent failed to parse malformed JSON from ResearcherAgent"
        },
        "metadata": {
            "agent_name": "SynthesizerAgent",
            "timestamp": "2025-09-13T15:10:15Z"
        }
    }
    return webhook_payload

def test_aha_backend():
    """Test if AHA backend is running"""
    try:
        response = requests.get(f"{AHA_BACKEND}/")
        if response.status_code == 200:
            print("✅ AHA Backend is running")
            print(f"   Response: {response.json()}")
            return True
        else:
            print(f"❌ AHA Backend returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ AHA Backend is not running")
        return False

def send_webhook():
    """Send a simulated webhook to AHA"""
    webhook_payload = simulate_langsmith_webhook()
    
    try:
        print(f"\n📡 Sending webhook to AHA...")
        print(f"   Trace ID: {webhook_payload['trace_id']}")
        print(f"   Error: {webhook_payload['error']['message']}")
        
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
            print(f"❌ Webhook failed with status {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to AHA backend")
        return False

def check_incidents():
    """Check if incidents were created"""
    try:
        response = requests.get(f"{AHA_BACKEND}/api/incidents")
        if response.status_code == 200:
            incidents = response.json()
            print(f"\n📊 Found {len(incidents)} incidents")
            for incident in incidents:
                print(f"   - {incident.get('trace_id', 'unknown')}: {incident.get('diagnosis', 'No diagnosis')}")
            return incidents
        else:
            print(f"❌ Failed to fetch incidents: {response.status_code}")
            return []
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to AHA backend")
        return []

def main():
    print("🚀 AHA Demo Workflow")
    print("=" * 50)
    
    # Test backend
    if not test_aha_backend():
        print("\n❌ Please start the AHA backend first:")
        print("   ./run_backend.sh")
        return
    
    # Send webhook
    if send_webhook():
        print("\n⏳ Waiting for AHA to process...")
        time.sleep(5)
        
        # Check incidents
        incidents = check_incidents()
        
        if incidents:
            print(f"\n🎉 AHA Demo Complete!")
            print(f"   Check the dashboard at: http://localhost:3000")
        else:
            print(f"\n⚠️  No incidents found - check AHA logs")

if __name__ == "__main__":
    main()
