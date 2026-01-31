/**
 * Food Analyzer Agent - Mastra Implementation
 *
 * Analyzes food photos and estimates nutritional content.
 * Uses Llama 4 Scout via Groq for free, fast vision analysis.
 */

import { Agent } from "@mastra/core/agent";
import { createTool } from "@mastra/core/tools";
import { createGroq } from "@ai-sdk/groq";
import { z } from "zod";
import { createFoodLog, getUser } from "../../supabase";
import { FoodItem } from "../../types";
import { getMealTypeByTime } from "../../utils/validation";

const GROQ_MODEL = process.env.GROQ_VISION_MODEL || "meta-llama/llama-4-scout-17b-16e-instruct";
const groqProvider = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

// Helper: Accept both number and string at JSON Schema level for Groq compatibility
// Llama 4 Scout outputs strings instead of numbers for tool parameters
const flexibleNumber = z.union([z.number(), z.string()]).describe("number");

// Schema for food items - accepts string calories for LLM compatibility
const foodItemSchema = z.object({
  name: z.string(),
  calories: z.union([z.number(), z.string()]),
  portion: z.string(),
});

// Accept both array and stringified JSON array
const flexibleFoodItems = z.union([
  z.array(foodItemSchema),
  z.string(),
]);

// Helper to parse food items (handles stringified JSON)
function parseFoodItems(items: unknown): FoodItem[] {
  if (typeof items === "string") {
    try {
      const parsed = JSON.parse(items);
      if (Array.isArray(parsed)) {
        return parsed.map((item: { name?: string; calories?: string | number; portion?: string }) => ({
          name: String(item.name || ""),
          calories: Number(item.calories) || 0,
          portion: String(item.portion || ""),
        }));
      }
    } catch {
      return [];
    }
  }
  if (Array.isArray(items)) {
    return items.map((item: { name?: string; calories?: string | number; portion?: string }) => ({
      name: String(item.name || ""),
      calories: Number(item.calories) || 0,
      portion: String(item.portion || ""),
    }));
  }
  return [];
}

const logFoodToDatabaseTool = createTool({
  id: "log_food_to_database",
  description: "Logs the analyzed food data to the database after analyzing a meal photo.",
  inputSchema: z.object({
    telegram_id: flexibleNumber.describe("The Telegram user ID"),
    calories: flexibleNumber.describe("Total estimated calories for the meal"),
    protein: flexibleNumber.describe("Estimated protein in grams"),
    carbs: flexibleNumber.describe("Estimated carbohydrates in grams"),
    fat: flexibleNumber.describe("Estimated fat in grams"),
    food_items: flexibleFoodItems.describe("Array of food items with name, calories, and portion"),
    notes: z.string().describe("Brief notes about the meal"),
  }),
  execute: async (input) => {
    // Convert string inputs to numbers (Llama 4 Scout outputs strings)
    const telegram_id = Number(input.telegram_id);
    const calories = Number(input.calories);
    const protein = Number(input.protein);
    const carbs = Number(input.carbs);
    const fat = Number(input.fat);
    const food_items = parseFoodItems(input.food_items);
    const notes = input.notes;

    const user = await getUser(telegram_id);
    const meal_type = getMealTypeByTime(user?.timezone || "UTC");

    const foodLog = await createFoodLog({
      telegram_id,
      calories,
      protein,
      carbs,
      fat,
      food_items: food_items as FoodItem[],
      meal_type,
      notes,
    });

    if (foodLog) {
      return {
        status: "success",
        message: "Food logged successfully",
        food_log_id: foodLog.id,
      };
    }
    return {
      status: "error",
      message: "Failed to log food to database",
    };
  },
});

export const FOOD_ANALYZER_AGENT_NAME = "food_analyzer_agent";

export const foodAnalyzerAgent = new Agent({
  id: FOOD_ANALYZER_AGENT_NAME,
  name: "Food Analyzer",
  model: groqProvider(GROQ_MODEL),
  instructions: `You are a nutrition expert that analyzes food photos.

When given a food photo:
1. Identify all visible food items and estimate portion sizes
2. Estimate the nutritional content (calories, protein, carbs, fat)
3. Provide brief, helpful notes (e.g., "Good protein source!", "Consider adding vegetables")
4. When you are 90% sure it is not a photo depicting food, do not run step 5. Instead ask user to confirm they uploaded the right image.
5. Use the log_food_to_database tool to save the analysis

Note: Meal type is automatically determined based on the time of logging, so you don't need to specify it.

Be reasonable with estimates - it's better to be approximately right than precisely wrong.
For ambiguous items, use typical serving sizes.

After logging, respond with a friendly summary like:
"
🍽️ [main items - list them nicely]

📊 Nutrition Breakdown:
   • Calories: ~[X] kcal
   • Protein: [X]g
   • Carbs: [X]g
   • Fat: [X]g

💡 [brief tip or observation]
"`,
  tools: {
    logFoodToDatabase: logFoodToDatabaseTool,
  },
});
