/**
 * Multi-Agent Research Team built with CoreSpeed's Zypher Agent
 * This serves as the "Target System" that AHA will monitor
 */

import { AnthropicModelProvider, ZypherAgent } from "@corespeed/zypher";
import { eachValueFrom } from "rxjs-for-await";

// Helper function to safely get environment variables
function getRequiredEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}

class ZypherResearchTeam {
  private plannerAgent: ZypherAgent;
  private researcherAgent1: ZypherAgent;
  private researcherAgent2: ZypherAgent;
  private synthesizerAgent: ZypherAgent;

  constructor() {
    // Create multiple Zypher agents for different roles
    const modelProvider = new AnthropicModelProvider({
      apiKey: getRequiredEnv("ANTHROPIC_API_KEY"),
    });

    this.plannerAgent = new ZypherAgent(modelProvider);
    this.researcherAgent1 = new ZypherAgent(modelProvider);
    this.researcherAgent2 = new ZypherAgent(modelProvider);
    this.synthesizerAgent = new ZypherAgent(modelProvider);
  }

  async init() {
    // Initialize all agents and register MCP servers for web crawling
    const agents = [
      this.plannerAgent,
      this.researcherAgent1, 
      this.researcherAgent2,
      this.synthesizerAgent
    ];

    for (const agent of agents) {
      await agent.mcpServerManager.registerServer({
        id: "firecrawl",
        type: "command",
        command: {
          command: "npx",
          args: ["-y", "firecrawl-mcp"],
          env: {
            FIRECRAWL_API_KEY: getRequiredEnv("FIRECRAWL_API_KEY"),
          },
        },
      });
      
      await agent.init();
    }
  }

  async executeResearch(mainQuery: string): Promise<string> {
    console.log(`\n=== Starting Zypher Research for: ${mainQuery} ===`);
    
    try {
      // Step 1: Planning with PlannerAgent
      console.log("🧠 PlannerAgent: Breaking down the query...");
      const planningTask = `Break down this research query into 2-3 specific subtasks: "${mainQuery}"`;
      
      const planEvent$ = this.plannerAgent.runTask(planningTask, "claude-sonnet-4-20250514");
      let subtasks: string[] = [];
      
      for await (const event of eachValueFrom(planEvent$)) {
        if (event.type === 'completion') {
          // Parse the planning result to extract subtasks
          const planText = event.content;
          subtasks = this.extractSubtasks(planText);
          console.log(`📋 Planned subtasks: ${subtasks.join(', ')}`);
        }
      }

      // Step 2: Research with ResearcherAgents
      const researchResults: string[] = [];
      
      // Researcher 1
      if (subtasks[0]) {
        console.log(`🔍 ResearcherAgent-1: Researching "${subtasks[0]}"...`);
        const research1Event$ = this.researcherAgent1.runTask(
          `Research this topic thoroughly: ${subtasks[0]}`,
          "claude-sonnet-4-20250514"
        );
        
        for await (const event of eachValueFrom(research1Event$)) {
          if (event.type === 'completion') {
            let result = event.content;
            
            // Inject malformed JSON for demo purposes
            if (mainQuery.toLowerCase().includes('malformed')) {
              result = `{ "research": "incomplete json without closing`;
            }
            
            researchResults.push(result);
          }
        }
      }

      // Researcher 2
      if (subtasks[1]) {
        console.log(`🔍 ResearcherAgent-2: Researching "${subtasks[1]}"...`);
        const research2Event$ = this.researcherAgent2.runTask(
          `Research this topic thoroughly: ${subtasks[1]}`,
          "claude-sonnet-4-20250514"
        );
        
        for await (const event of eachValueFrom(research2Event$)) {
          if (event.type === 'completion') {
            researchResults.push(event.content);
          }
        }
      }

      // Step 3: Synthesis with SynthesizerAgent
      console.log(`📝 SynthesizerAgent: Synthesizing ${researchResults.length} research results...`);
      
      const synthesisPrompt = `Synthesize these research results into a comprehensive report:
      
${researchResults.map((result, i) => `Research Result ${i + 1}:\n${result}\n`).join('\n')}

Create a well-structured final report.`;

      const synthesisEvent$ = this.synthesizerAgent.runTask(
        synthesisPrompt,
        "claude-sonnet-4-20250514"
      );
      
      let finalReport = "";
      for await (const event of eachValueFrom(synthesisEvent$)) {
        if (event.type === 'completion') {
          finalReport = event.content;
        }
      }

      console.log("\n=== Zypher Research Complete ===");
      return finalReport;

    } catch (error) {
      console.log(`\n=== Zypher Research Failed: ${error.message} ===`);
      throw error;
    }
  }

  private extractSubtasks(planText: string): string[] {
    // Simple extraction logic - in production this would be more sophisticated
    const lines = planText.split('\n');
    const tasks: string[] = [];
    
    for (const line of lines) {
      if (line.match(/^\d+\./) || line.includes('-')) {
        const cleaned = line.replace(/^\d+\.?\s*/, '').replace(/^-\s*/, '').trim();
        if (cleaned.length > 10) {
          tasks.push(cleaned);
        }
      }
    }
    
    return tasks.slice(0, 3); // Max 3 subtasks
  }
}

// Demo execution
async function main() {
  const team = new ZypherResearchTeam();
  await team.init();
  
  // Normal operation test
  console.log("Testing normal Zypher operation...");
  try {
    const result = await team.executeResearch("AI trends in enterprise automation 2024");
    console.log("SUCCESS: Normal Zypher operation completed");
  } catch (error) {
    console.log(`FAILED: ${error}`);
  }
  
  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Failure scenario test
  console.log("\n" + "=".repeat(50));
  console.log("Testing Zypher failure scenario...");
  try {
    const result = await team.executeResearch("Demo malformed JSON handling in AI systems");
    console.log("UNEXPECTED: Failure scenario succeeded");
  } catch (error) {
    console.log(`EXPECTED FAILURE: ${error}`);
  }
}

if (import.meta.main) {
  main().catch(console.error);
}
