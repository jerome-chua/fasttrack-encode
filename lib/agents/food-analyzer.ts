import { FunctionTool, LlmAgent } from "@google/adk";
import { z } from "zod";
import { createFoodLog, FoodItem } from "../supabase";
import { getMealTypeByTime } from "../utils/validation";

const logFoodToDatabase = new FunctionTool({
  name: "log_food_to_database",
  description: "Logs the analyzed food data to the database after analyzing a meal photo.",
  parameters: z.object({
    telegram_id: z.number().describe("The Telegram user ID"),
    calories: z.number().describe("Total estimated calories for the meal"),
    protein: z.number().describe("Estimated protein in grams"),
    carbs: z.number().describe("Estimated carbohydrates in grams"),
    fat: z.number().describe("Estimated fat in grams"),
    food_items: z.array(
      z.object({
        name: z.string().describe("Name of the food item"),
        calories: z.number().describe("Calories for this item"),
        portion: z.string().describe("Portion size description"),
      })
    ).describe("List of identified food items"),
    notes: z.string().describe("Brief notes about the meal, tips, or observations"),
  }),
  execute: async ({ telegram_id, calories, protein, carbs, fat, food_items, notes }) => {
    const meal_type = getMealTypeByTime();

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
export const foodAnalyzerAgent = new LlmAgent({
  name: FOOD_ANALYZER_AGENT_NAME,
  model: "gemini-2.5-flash",
  description: "Analyzes food photos and estimates nutritional content.",
  instruction: `You are a nutrition expert that analyzes food photos.

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
  tools: [logFoodToDatabase],
});
