"""
Demo script to inject failures for AHA demonstration
"""
import asyncio
import requests
import json
from datetime import datetime

# Mock webhook payload that simulates LangSmith sending an error
MOCK_WEBHOOK_PAYLOAD = {
    "trace_id": f"demo_trace_{int(datetime.now().timestamp())}",
    "run_id": f"demo_run_{int(datetime.now().timestamp())}",
    "project_name": "aha-demo",
    "status": "error",
    "error": {
        "type": "JSONDecodeError",
        "message": "Failed to parse research results from ResearcherAgent-2: Expecting ',' delimiter: line 1 column 45 (char 44)"
    },
    "metadata": {
        "agent": "SynthesizerAgent",
        "operation": "synthesize_results"
    }
}

async def inject_failure():
    """Send a mock webhook to trigger AHA processing"""
    webhook_url = "http://localhost:8000/webhook/langsmith"
    
    print("🚨 Injecting failure scenario...")
    print(f"Sending webhook to: {webhook_url}")
    print(f"Payload: {json.dumps(MOCK_WEBHOOK_PAYLOAD, indent=2)}")
    
    try:
        response = requests.post(
            webhook_url,
            json=MOCK_WEBHOOK_PAYLOAD,
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ Failure successfully injected!")
            print(f"Response: {response.json()}")
        else:
            print(f"❌ Failed to inject failure: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Error sending webhook: {e}")
        print("Make sure the AHA backend is running on http://localhost:8000")

if __name__ == "__main__":
    asyncio.run(inject_failure())
