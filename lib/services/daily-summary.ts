import { dailySummaryAgent } from "../mastra/agents/daily-summary-agent";

const DAILY_SUMMARY_TIMEOUT_MS = 30000; // 30 seconds

async function generateDailySummaryInternal(telegramId: number): Promise<string> {
  console.log("🤖 Starting Mastra daily summary agent...");

  const response = await dailySummaryAgent.generate(
    `Generate today's daily summary for telegram_id: ${telegramId}. Use the tools to gather their data.`,
    {
      maxSteps: 5,
    }
  );

  return response.text || "Unable to generate daily summary at this time.";
}

export async function generateDailySummary(telegramId: number): Promise<string> {
  const timeoutPromise = new Promise<string>((_, reject) => {
    setTimeout(() => reject(new Error("Daily summary generation timed out")), DAILY_SUMMARY_TIMEOUT_MS);
  });

  const summaryPromise = generateDailySummaryInternal(telegramId);

  return Promise.race([summaryPromise, timeoutPromise]);
}
