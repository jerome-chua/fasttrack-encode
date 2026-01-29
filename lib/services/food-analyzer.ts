import { foodAnalyzerAgent } from "../mastra/agents/food-analyzer";

export async function analyzeFoodPhoto(
  imageBase64: string,
  mimeType: string,
  telegramId: number
): Promise<string> {
  console.log("🤖 Starting Mastra food analyzer agent...");

  const response = await foodAnalyzerAgent.generate(
    [
      {
        role: "user",
        content: [
          {
            type: "image",
            image: imageBase64,
            mimeType: mimeType,
          },
          {
            type: "text",
            text: `Analyze this food photo and log it for telegram_id: ${telegramId}`,
          },
        ],
      },
    ],
    {
      maxSteps: 5,
    }
  );

  return response.text || "Unable to analyze the food photo.";
}
