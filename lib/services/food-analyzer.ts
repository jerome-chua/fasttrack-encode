import { foodAnalyzerAgent } from "../mastra/agents/food-analyzer";

export async function analyzeFoodPhoto(
  imageBase64: string,
  mimeType: string,
  telegramId: number
): Promise<string> {
  console.log("🤖 Starting Mastra food analyzer agent...");
  console.log("📷 Image mimeType:", mimeType);
  console.log("📷 Image base64 length:", imageBase64.length);

  try {
    const response = await foodAnalyzerAgent.generate(
      [
        {
          role: "user",
          content: [
            {
              type: "image",
              image: `data:${mimeType};base64,${imageBase64}`,
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

    console.log("✅ Agent response received:", response.text?.substring(0, 100));
    return response.text || "Unable to analyze the food photo.";
  } catch (error) {
    console.error("❌ Food analyzer error:", error);
    throw error;
  }
}
