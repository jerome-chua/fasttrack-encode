import { InMemoryRunner } from "@google/adk";
import { INSIGHTS_AGENT_NAME, insightsAgent } from "../agents/insights-agent";

const INSIGHTS_TIMEOUT_MS = 30000; // 30 seconds

async function generateInsightsInternal(telegramId: number): Promise<string> {
  console.log("🤖 Starting Insights Agent...");

  const runner = new InMemoryRunner({
    agent: insightsAgent,
    appName: "insightsGenerator",
  });

  const userId = telegramId.toString();
  const session = await runner.sessionService.createSession({
    appName: "insightsGenerator",
    userId,
  });

  const newMessage = {
    role: "user" as const,
    parts: [
      {
        text: `Generate personalized health insights for telegram_id: ${telegramId}. Use all available tools to gather their data, then provide comprehensive insights.`,
      },
    ],
  };

  let agentResponse = "";
  for await (const event of runner.runAsync({
    userId,
    sessionId: session.id,
    newMessage,
  })) {
    console.log("📨 Event received:", event.author, event.content?.parts?.length, "parts");
    const isAgentResponse = event.author === INSIGHTS_AGENT_NAME;
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

export async function generateInsights(telegramId: number): Promise<string> {
  const timeoutPromise = new Promise<string>((_, reject) => {
    setTimeout(() => reject(new Error("Insights generation timed out")), INSIGHTS_TIMEOUT_MS);
  });

  const insightsPromise = generateInsightsInternal(telegramId);

  return Promise.race([insightsPromise, timeoutPromise]);
}
