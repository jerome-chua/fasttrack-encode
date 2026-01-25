import { Context } from "grammy";
import { menuKeyboard } from "../constants/keyboards";
import { MENU_MESSAGES, INSIGHTS_MESSAGES } from "../constants/messages";
import { getUser } from "../supabase";
import { generateInsights } from "../services/insights";

// Handle menu button: Food Log
export async function handleFoodLogButton(ctx: Context): Promise<void> {
  await ctx.reply(
    MENU_MESSAGES.FOOD_LOG,
    { reply_markup: menuKeyboard }
  );
}

// Handle menu button: Get Insights
export async function handleGetInsightsButton(ctx: Context): Promise<void> {
  const telegramId = ctx.from?.id;
  if (!telegramId) return;

  try {
    // Check if user has completed onboarding
    const user = await getUser(telegramId);
    if (!user || user.onboarding_step !== "completed") {
      await ctx.reply(INSIGHTS_MESSAGES.ONBOARDING_REQUIRED, { reply_markup: menuKeyboard });
      return;
    }

    // Send loading message
    await ctx.reply(INSIGHTS_MESSAGES.GENERATING, { reply_markup: menuKeyboard });

    // Generate insights using the agent
    const insights = await generateInsights(telegramId);

    // Send the insights (or fallback message)
    await ctx.reply(
      insights || INSIGHTS_MESSAGES.GENERATION_ERROR,
      { reply_markup: menuKeyboard }
    );
  } catch (error) {
    console.error("❌ Error generating insights:", error);
    await ctx.reply(
      INSIGHTS_MESSAGES.GENERATION_ERROR,
      { reply_markup: menuKeyboard }
    );
  }
}

// Handle menu button: Ask Questions
export async function handleAskQuestionsButton(ctx: Context): Promise<void> {
  await ctx.reply(
    MENU_MESSAGES.ASK_QUESTIONS,
    { reply_markup: menuKeyboard }
  );
}
