import { Context } from "grammy";
import { menuKeyboard } from "../constants/keyboards";
import { MENU_MESSAGES } from "../constants/messages";

// Handle menu button: Food Log
export async function handleFoodLogButton(ctx: Context): Promise<void> {
  await ctx.reply(
    MENU_MESSAGES.FOOD_LOG,
    { reply_markup: menuKeyboard }
  );
}

// Handle menu button: Get Insights
export async function handleGetInsightsButton(ctx: Context): Promise<void> {
  await ctx.reply(
    MENU_MESSAGES.GET_INSIGHTS,
    { reply_markup: menuKeyboard }
  );
}

// Handle menu button: Ask Questions
export async function handleAskQuestionsButton(ctx: Context): Promise<void> {
  await ctx.reply(
    MENU_MESSAGES.ASK_QUESTIONS,
    { reply_markup: menuKeyboard }
  );
}
