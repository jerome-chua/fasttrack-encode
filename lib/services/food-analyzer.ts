import { InMemoryRunner } from "@google/adk";
import { foodAnalyzerAgent } from "../agents/food-analyzer";

// Analyze food photo using the ADK agent
export async function analyzeFoodPhoto(
  imageBase64: string,
  mimeType: string,
  telegramId: number
): Promise<string> {
  console.log("🤖 Starting ADK agent...");
  const runner = new InMemoryRunner({
    agent: foodAnalyzerAgent,
    appName: "fasttrack",
  });

  // Create a session for this user
  const userId = telegramId.toString();
  const session = await runner.sessionService.createSession({
    appName: "fasttrack",
    userId,
  });

  // Build the message with image
  const newMessage = {
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

  // Run the agent and collect events
  let agentResponse = "";
  console.log("🚀 Running agent for session:", session.id);
  for await (const event of runner.runAsync({
    userId,
    sessionId: session.id,
    newMessage,
  })) {
    console.log("📨 Event received:", event.author, event.content?.parts?.length, "parts");
    // Only capture text from the agent's final response (after tool execution)
    // Skip tool calls and intermediate responses
    if (event.author === "food_analyzer_agent" && event.content?.parts) {
      // Clear previous response to only keep the latest (final) agent response
      agentResponse = "";
      for (const part of event.content.parts) {
        if ("text" in part && part.text) {
          agentResponse += part.text;
        }
      }
    }
  }

  console.log("✅ Agent response:", agentResponse.substring(0, 100) + "...");
  return agentResponse;
}
