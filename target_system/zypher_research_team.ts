import { AnthropicModelProvider, ZypherAgent } from "@corespeed/zypher";
import { eachValueFrom } from "rxjs-for-await";

function getRequiredEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}

class ZypherResearchTeam {
  private agent: ZypherAgent;

  constructor() {
    this.agent = new ZypherAgent(
      new AnthropicModelProvider({
        apiKey: getRequiredEnv("ANTHROPIC_API_KEY"),
      }),
    );
  }

  async init() {
    await this.agent.init();
  }

  async runResearch(query: string): Promise<void> {
    console.log(`\n=== Starting Zypher Research for: ${query} ===`);
    
    try {
      const event$ = this.agent.runTask(
        query,
        "claude-3-5-haiku-20241022", // Use current model
      );

      for await (const event of eachValueFrom(event$)) {
        console.log("📊 Event:", JSON.stringify(event, null, 2));
      }
      
      console.log(`\n🎉 Zypher Research completed successfully!`);
      
    } catch (error) {
      console.log(`\n❌ Zypher Research Failed: ${error} ===`);
      throw error;
    }
  }
}

async function main() {
  const researchTeam = new ZypherResearchTeam();
  await researchTeam.init();

  const mainQuery = Deno.args[0] || "Find latest AI news and trends";

  // Test normal operation first
  console.log("Testing normal Zypher operation...");
  try {
    await researchTeam.runResearch(`AI trends in enterprise automation 2024`);
  } catch (error) {
    console.log(`EXPECTED FAILURE: ${error}`);
  }

  // Test failure scenario
  console.log("\n" + "=".repeat(50));
  console.log("Testing Zypher failure scenario...");
  try {
    await researchTeam.runResearch(`Demo malformed JSON handling in AI systems`);
  } catch (error) {
    console.log(`EXPECTED FAILURE: ${error}`);
  }
}

if (import.meta.main) {
  main().catch(console.error);
}
