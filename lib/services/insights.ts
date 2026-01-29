import { insightsAgent } from "../mastra/agents/insights-agent";

const INSIGHTS_TIMEOUT_MS = 45000; // 45 seconds

async function generateInsightsInternal(telegramId: number): Promise<string> {
  console.log("🤖 Starting Mastra insights agent...");

  try {
    const response = await insightsAgent.generate(
      `Generate personalized health insights for telegram_id: ${telegramId}. Use all available tools to gather their data, then provide comprehensive insights.`,
      {
        maxSteps: 10,
      }
    );

    console.log("✅ generateInsightsInternal: Insights response:", response.text?.substring(0, 100));
    return response.text || "Unable to generate insights at this time.";
  } catch (error) {
    console.error("❌ Insights agent error:", error);
    throw error;
  }
}

export async function generateInsights(telegramId: number): Promise<string> {
  const timeoutPromise = new Promise<string>((_, reject) => {
    setTimeout(() => reject(new Error("Insights generation timed out")), INSIGHTS_TIMEOUT_MS);
  });

  const insightsPromise = generateInsightsInternal(telegramId);

  return Promise.race([insightsPromise, timeoutPromise]);
}
