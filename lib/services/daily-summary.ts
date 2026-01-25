import { InMemoryRunner } from "@google/adk";
import { DAILY_SUMMARY_AGENT_NAME, dailySummaryAgent } from "../agents/daily-summary-agent";

const DAILY_SUMMARY_TIMEOUT_MS = 30000; // 30 seconds

async function generateDailySummaryInternal(telegramId: number): Promise<string> {
  const APP_NAME = "dailySummaryGenerator";
  const runner = new InMemoryRunner({
    agent: dailySummaryAgent,
    appName: APP_NAME,
  });

  const userId = telegramId.toString();
  const session = await runner.sessionService.createSession({
    appName: APP_NAME,
    userId,
  });

  const newMessage = {
    role: "user" as const,
    parts: [
      {
        text: `Generate today's daily summary for telegram_id: ${telegramId}. Use the tools to gather their data.`,
      },
    ],
  };

  let agentResponse = "";
  for await (const event of runner.runAsync({
    userId,
    sessionId: session.id,
    newMessage,
  })) {
    const isAgentResponse = event.author === DAILY_SUMMARY_AGENT_NAME;
    const contentParts = event.content?.parts;

    if (isAgentResponse && contentParts) {
      agentResponse = "";
      for (const part of contentParts) {
        if ("text" in part && part.text) {
          agentResponse += part.text;
        }
      }
    }
  }

  return agentResponse;
}

export async function generateDailySummary(telegramId: number): Promise<string> {
  const timeoutPromise = new Promise<string>((_, reject) => {
    setTimeout(() => reject(new Error("Daily summary generation timed out")), DAILY_SUMMARY_TIMEOUT_MS);
  });

  const summaryPromise = generateDailySummaryInternal(telegramId);

  return Promise.race([summaryPromise, timeoutPromise]);
}
