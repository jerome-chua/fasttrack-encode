import { Context } from "grammy";
import { menuButtons } from "../constants/keyboards";
import { MENU_MESSAGES, INSIGHTS_MESSAGES, DAILY_SUMMARY_MESSAGES, QUESTIONS_MESSAGES } from "../constants/messages";
import { getUser } from "../supabase";
import { generateInsights } from "../services/insights";
import { generateDailySummary } from "../services/daily-summary";

// Handle menu button: Food Log
export async function handleFoodLogButton(ctx: Context): Promise<void> {
  await ctx.reply(
    MENU_MESSAGES.FOOD_LOG,
    { reply_markup: menuButtons }
  );
}

// Handle menu button: Daily Summary
export async function handleDailySummaryButton(ctx: Context): Promise<void> {
  const telegramId = ctx.from?.id;
  if (!telegramId) return;

  try {
    const user = await getUser(telegramId);
    if (!user || user.onboarding_step !== "completed") {
      await ctx.reply(DAILY_SUMMARY_MESSAGES.ONBOARDING_REQUIRED, { reply_markup: menuButtons });
      return;
    }

    await ctx.reply(DAILY_SUMMARY_MESSAGES.GENERATING, { reply_markup: menuButtons });

    const summary = await generateDailySummary(telegramId);
    await ctx.reply(
      summary || DAILY_SUMMARY_MESSAGES.GENERATION_ERROR,
      { reply_markup: menuButtons }
    );
  } catch (error) {
    console.error("❌ Error generating daily summary:", error);
    await ctx.reply(
      DAILY_SUMMARY_MESSAGES.GENERATION_ERROR,
      { reply_markup: menuButtons }
    );
  }
}

// Handle menu button: Get Insights
export async function handleGetInsightsButton(ctx: Context): Promise<void> {
  const telegramId = ctx.from?.id;
  if (!telegramId) return;

  try {
    const user = await getUser(telegramId);
    if (!user || user.onboarding_step !== "completed") {
      await ctx.reply(INSIGHTS_MESSAGES.ONBOARDING_REQUIRED, { reply_markup: menuButtons });
      return;
    }

    await ctx.reply(INSIGHTS_MESSAGES.GENERATING, { reply_markup: menuButtons });

    const insights = await generateInsights(telegramId);
    await ctx.reply(
      insights || INSIGHTS_MESSAGES.GENERATION_ERROR,
      { reply_markup: menuButtons }
    );
  } catch (error) {
    console.error("❌ Error generating insights:", error);
    await ctx.reply(
      INSIGHTS_MESSAGES.GENERATION_ERROR,
      { reply_markup: menuButtons }
    );
  }
}

// Handle menu button: Ask Questions
export async function handleAskQuestionsButton(ctx: Context): Promise<void> {
  await ctx.reply(
    QUESTIONS_MESSAGES.PROMPT,
    { reply_markup: menuButtons }
  );
}
