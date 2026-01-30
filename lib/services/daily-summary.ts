import { mastra } from "../mastra";

const DAILY_SUMMARY_TIMEOUT_MS = 30000; // 30 seconds

async function generateDailySummaryInternal(telegramId: number): Promise<string> {
  console.log("🤖 Starting Mastra daily summary agent...");

  try {
    const agent = mastra.getAgent("dailySummaryAgent");
    const response = await agent.generate(
      `Generate today's daily summary for telegram_id: ${telegramId}. Use the tools to gather their data.`,
      {
        maxSteps: 5,
      }
    );

    console.log("✅ Daily summary response:", response.text?.substring(0, 100));
    return response.text || "Unable to generate daily summary at this time.";
  } catch (error) {
    console.error("❌ Daily summary agent error:", error);
    throw error;
  }
}

export async function generateDailySummary(telegramId: number): Promise<string> {
  const timeoutPromise = new Promise<string>((_, reject) => {
    setTimeout(() => reject(new Error("Daily summary generation timed out")), DAILY_SUMMARY_TIMEOUT_MS);
  });

  const summaryPromise = generateDailySummaryInternal(telegramId);

  return Promise.race([summaryPromise, timeoutPromise]);
}
