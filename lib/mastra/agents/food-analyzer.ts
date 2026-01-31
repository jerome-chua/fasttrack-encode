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

// Schema for food items - handles both array and stringified JSON from LLM
const foodItemSchema = z.object({
  name: z.string().describe("Name of the food item"),
  calories: z.coerce.number().describe("Calories for this item"),
  portion: z.string().describe("Portion size description"),
});

// Transform that handles stringified JSON arrays from LLMs
const foodItemsTransform = z.union([
  z.array(foodItemSchema),
  z.string().transform((str) => {
    try {
      const parsed = JSON.parse(str);
      return z.array(foodItemSchema).parse(parsed);
    } catch {
      return [];
    }
  }),
]);

const logFoodToDatabaseTool = createTool({
  id: "log_food_to_database",
  description: "Logs the analyzed food data to the database after analyzing a meal photo. IMPORTANT: All numeric values must be numbers, not strings. food_items must be a JSON array.",
  inputSchema: z.object({
    telegram_id: z.coerce.number().describe("The Telegram user ID (number)"),
    calories: z.coerce.number().describe("Total estimated calories for the meal (number)"),
    protein: z.coerce.number().describe("Estimated protein in grams (number)"),
    carbs: z.coerce.number().describe("Estimated carbohydrates in grams (number)"),
    fat: z.coerce.number().describe("Estimated fat in grams (number)"),
    food_items: foodItemsTransform.describe("List of identified food items as JSON array"),
    notes: z.string().describe("Brief notes about the meal, tips, or observations"),
  }),
  execute: async (input) => {
    const { telegram_id, calories, protein, carbs, fat, food_items, notes } = input;

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
