import { InMemoryRunner } from "@google/adk";
import { FOOD_ANALYZER_AGENT_NAME, foodAnalyzerAgent } from "../agents/food-analyzer";

export async function analyzeFoodPhoto(
  imageBase64: string,
  mimeType: string,
  telegramId: number
): Promise<string> {
  console.log("🤖 Starting ADK agent...");
  const runner = new InMemoryRunner({
    agent: foodAnalyzerAgent,
    appName: "foodAnalyzer",
  });

  const userId = telegramId.toString();
  const session = await runner.sessionService.createSession({
    appName: "foodAnalyzer",
    userId,
  });

  const newMessageWithImage = {
    role: "user" as const,
    parts: [
      {
        inlineData: {
          mimeType,
          data: imageBase64,
        },
      },
      {
        text: `Analyze this food photo and log it for telegram_id: ${telegramId}`,
      },
    ],
  };

  let agentResponse = "";
  for await (const event of runner.runAsync({
    userId,
    sessionId: session.id,
    newMessage: newMessageWithImage,
  })) {
    console.log("📨 Event received:", event.author, event.content?.parts?.length, "parts");
    const isAgentResponse = event.author === FOOD_ANALYZER_AGENT_NAME;
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
