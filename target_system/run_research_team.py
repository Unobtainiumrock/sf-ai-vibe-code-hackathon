"""
Multi-Agent Research Team - Target System for AHA Demo
"""
import os
import json
import asyncio
from typing import List, Dict, Any
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class ResearchAgent:
    """Agent that performs web research using Tavily"""
    
    def __init__(self, name: str):
        self.name = name
    
    async def research(self, query: str) -> Dict[str, Any]:
        """Perform research on the given query"""
        print(f"[{self.name}] Researching: {query}")
        
        # Simulate research with potential for malformed JSON
        if "malformed" in query.lower():
            # This will cause a JSON parsing error in the synthesizer
            return {
                "query": query,
                "results": "{ invalid json structure without closing brace",
                "source": self.name
            }
        
        # Normal research result
        return {
            "query": query,
            "results": [
                {
                    "title": f"Research Result for {query}",
                    "content": f"Detailed analysis of {query} from {self.name}",
                    "url": "https://example.com/research"
                }
            ],
            "source": self.name
        }

class SynthesizerAgent:
    """Agent that synthesizes research results into a final report"""
    
    def __init__(self):
        self.name = "SynthesizerAgent"
    
    async def synthesize(self, research_results: List[Dict[str, Any]]) -> str:
        """Synthesize research results into a final report"""
        print(f"[{self.name}] Synthesizing {len(research_results)} research results")
        
        # This is where the JSON parsing error will occur
        for result in research_results:
            if isinstance(result.get("results"), str):
                try:
                    # Try to parse as JSON - this will fail with malformed data
                    json.loads(result["results"])
                except json.JSONDecodeError as e:
                    raise ValueError(f"Failed to parse research results from {result.get('source', 'unknown')}: {str(e)}")
        
        # Normal synthesis
        report = "# Research Report\n\n"
        for result in research_results:
            report += f"## From {result['source']}\n"
            if isinstance(result["results"], list):
                for item in result["results"]:
                    report += f"- {item['title']}: {item['content']}\n"
            report += "\n"
        
        return report

class PlannerAgent:
    """Agent that decomposes queries into sub-tasks"""
    
    def __init__(self):
        self.name = "PlannerAgent"
    
    async def plan(self, query: str) -> List[str]:
        """Break down the main query into sub-tasks"""
        print(f"[{self.name}] Planning for query: {query}")
        
        # Simple planning logic
        if "demo" in query.lower() and "malformed" in query.lower():
            return [
                "Research current trends in the topic",
                "Find malformed data examples",  # This will trigger the error
                "Analyze best practices"
            ]
        
        return [
            "Research current trends in the topic",
            "Analyze market data",
            "Identify key challenges"
        ]

class MultiAgentResearchTeam:
    """Orchestrator for the multi-agent research team"""
    
    def __init__(self):
        self.planner = PlannerAgent()
        self.researchers = [
            ResearchAgent("ResearcherAgent-1"),
            ResearchAgent("ResearcherAgent-2")
        ]
        self.synthesizer = SynthesizerAgent()
    
    async def research(self, main_query: str) -> str:
        """Execute the full research workflow"""
        print(f"\n=== Starting Research for: {main_query} ===")
        
        try:
            # Step 1: Planning
            subtasks = await self.planner.plan(main_query)
            print(f"Planned subtasks: {subtasks}")
            
            # Step 2: Research
            research_results = []
            for i, task in enumerate(subtasks):
                researcher = self.researchers[i % len(self.researchers)]
                result = await researcher.research(task)
                research_results.append(result)
            
            # Step 3: Synthesis
            final_report = await self.synthesizer.synthesize(research_results)
            
            print("\n=== Research Complete ===")
            return final_report
            
        except Exception as e:
            print(f"\n=== Research Failed: {str(e)} ===")
            raise

async def main():
    """Main demo function"""
    team = MultiAgentResearchTeam()
    
    # Normal query first
    print("Testing normal operation...")
    try:
        result = await team.research("AI trends in 2024")
        print("SUCCESS: Normal operation completed")
    except Exception as e:
        print(f"FAILED: {e}")
    
    # Wait a bit
    await asyncio.sleep(2)
    
    # Query that will cause failure
    print("\n" + "="*50)
    print("Testing failure scenario...")
    try:
        result = await team.research("Demo malformed JSON handling in AI systems")
        print("UNEXPECTED: Failure scenario succeeded")
    except Exception as e:
        print(f"EXPECTED FAILURE: {e}")

if __name__ == "__main__":
    asyncio.run(main())
