#!/usr/bin/env python3
"""
Test script to run Zypher with LangSmith integration
This will be our target system that AHA monitors
"""
import subprocess
import os
import sys
import time
import json
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def run_zypher_with_langsmith(query: str):
    """Run the Zypher research team with LangSmith tracing"""
    
    # Set up environment variables
    env = os.environ.copy()
    env.update({
        "LANGSMITH_API_KEY": os.getenv("LANGSMITH_API_KEY"),
        "LANGSMITH_PROJECT": os.getenv("LANGSMITH_PROJECT", "aha-demo"),
        "ANTHROPIC_API_KEY": os.getenv("ANTHROPIC_API_KEY"),
        "LANGCHAIN_TRACING_V2": "true",
        "LANGCHAIN_ENDPOINT": "https://api.smith.langchain.com",
        "LANGCHAIN_API_KEY": os.getenv("LANGSMITH_API_KEY"),
        "LANGCHAIN_PROJECT": os.getenv("LANGSMITH_PROJECT", "aha-demo")
    })
    
    print(f"🚀 Starting Zypher Research Team with LangSmith tracing...")
    print(f"📊 Query: {query}")
    print(f"🔗 LangSmith Project: {env.get('LANGSMITH_PROJECT')}")
    print("=" * 60)
    
    try:
        # Run the Zypher system
        result = subprocess.run(
            ["deno", "task", "dev", query],
            cwd="target_system",
            env=env,
            capture_output=True,
            text=True,
            timeout=120  # 2 minute timeout
        )
        
        print("📤 Zypher Output:")
        print(result.stdout)
        
        if result.stderr:
            print("⚠️  Zypher Errors:")
            print(result.stderr)
        
        if result.returncode != 0:
            print(f"❌ Zypher failed with return code: {result.returncode}")
            return {
                "status": "error",
                "error": result.stderr or "Unknown error",
                "timestamp": datetime.now().isoformat(),
                "query": query
            }
        else:
            print("✅ Zypher completed successfully")
            return {
                "status": "success", 
                "output": result.stdout,
                "timestamp": datetime.now().isoformat(),
                "query": query
            }
            
    except subprocess.TimeoutExpired:
        print("⏰ Zypher timed out after 2 minutes")
        return {
            "status": "timeout",
            "error": "Process timed out",
            "timestamp": datetime.now().isoformat(),
            "query": query
        }
    except Exception as e:
        print(f"💥 Unexpected error: {str(e)}")
        return {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.now().isoformat(),
            "query": query
        }

def main():
    if len(sys.argv) < 2:
        query = "Find latest AI news and trends"
    else:
        query = " ".join(sys.argv[1:])
    
    print("�� Zypher + LangSmith Integration Test")
    print("=" * 50)
    
    # Check required environment variables
    required_vars = ["LANGSMITH_API_KEY", "ANTHROPIC_API_KEY"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print(f"❌ Missing required environment variables: {missing_vars}")
        print("Please check your .env file")
        return 1
    
    # Run the test
    result = run_zypher_with_langsmith(query)
    
    print("\n" + "=" * 60)
    print("📋 Final Result:")
    print(json.dumps(result, indent=2))
    
    return 0 if result["status"] == "success" else 1

if __name__ == "__main__":
    sys.exit(main())
