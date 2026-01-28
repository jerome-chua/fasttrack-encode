import { Context } from "grammy";
import { getUser, createUser } from "../supabase";
import { User } from "../types";
import { menuButtons, locationRequestKeyboard } from "../constants/keyboards";
import { START_MESSAGES, ONBOARDING_MESSAGES } from "../constants/messages";
import { handleError } from "../utils/error-handler";
import { isLoginCode } from "../utils/validation";
import { handleLoginCode } from "./login";

// Send the appropriate onboarding prompt based on user's step
export async function sendOnboardingPrompt(ctx: Context, user: User): Promise<void> {
  const firstName = user.first_name;

  switch (user.onboarding_step) {
    case "weight":
      await ctx.reply(
        ONBOARDING_MESSAGES.WEIGHT(firstName),
        { reply_markup: { remove_keyboard: true } }
      );
      break;
    case "goal":
      await ctx.reply(
        ONBOARDING_MESSAGES.GOAL,
        { reply_markup: { remove_keyboard: true } }
      );
      break;
    case "height":
      await ctx.reply(
        ONBOARDING_MESSAGES.HEIGHT,
        { reply_markup: { remove_keyboard: true } }
      );
      break;
    case "timezone":
      await ctx.reply(
        ONBOARDING_MESSAGES.TIMEZONE,
        { reply_markup: locationRequestKeyboard }
      );
      break;
    case "completed":
      await ctx.reply(
        ONBOARDING_MESSAGES.COMPLETED,
        { reply_markup: menuButtons }
      );
      break;
  }
}

// Handle /start command
export async function handleStartCommand(ctx: Context): Promise<void> {
  const telegramId = ctx.from?.id;
  const firstName = ctx.from?.first_name ?? "there";

  if (!telegramId) {
    await ctx.reply(START_MESSAGES.IDENTIFICATION_ERROR);
    return;
  }

  try {
    // Check if this is a deep link with a login code (e.g., /start ABC12345)
    const messageText = ctx.message?.text || "";
    const parts = messageText.split(" ");
    if (parts.length > 1) {
      const potentialCode = parts[1].trim();
      if (isLoginCode(potentialCode)) {
        await handleLoginCode(ctx, potentialCode);
        return;
      }
    }

    // Check if user exists
    let user = await getUser(telegramId);

    if (user && user.onboarding_step === "completed") {
      // Returning user - show menu
      await ctx.reply(
        START_MESSAGES.WELCOME_BACK(firstName),
        { reply_markup: menuButtons }
      );
      return;
    }

    if (!user) {
      // New user - create and start onboarding
      user = await createUser(telegramId, firstName);
      if (!user) {
        await ctx.reply(START_MESSAGES.SETUP_ERROR);
        return;
      }
    }

    // Start/continue onboarding based on current step
    await sendOnboardingPrompt(ctx, user);
  } catch (error) {
    await handleError(ctx, error, START_MESSAGES.SETUP_ERROR);
  }
}
