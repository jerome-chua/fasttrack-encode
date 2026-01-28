import { Context } from "grammy";
import { getUser, updateUser, logWeight } from "../supabase";
import { menuButtons, manualTimezoneKeyboard } from "../constants/keyboards";
import { START_MESSAGES, ONBOARDING_MESSAGES, TEXT_MESSAGES, QUESTIONS_MESSAGES } from "../constants/messages";
import { isLoginCode, validateNumber, validateWeight, validateHeight } from "../utils/validation";
import { isValidTimezone } from "../utils/timezone";
import { handleLoginCode } from "./login";
import { sendOnboardingPrompt } from "./start";
import { handleError } from "../utils/error-handler";
import { answerQuestion } from "../services/questions";

// Button texts that should be handled by button handlers, not text handler
const BUTTON_TEXTS = new Set([
  "🤳🏼 Log Food",
  "☀️ Daily Summary",
  "🧠 Get Insights",
  "💬 Ask Questions",
]);

// Special button for timezone manual entry
const TIMEZONE_MANUAL_BUTTON = "Enter manually instead";

// Handle other text messages (onboarding flow + login codes)
export async function handleTextMessage(ctx: Context): Promise<void> {
  if (!ctx.message || !ctx.message.text) {
    return;
  }

  const telegramId = ctx.from?.id;
  const text = ctx.message.text.trim();

  if (!telegramId) return;

  if (BUTTON_TEXTS.has(text)) {
    return;
  }

  try {
    // Check if this is a login code (8 alphanumeric characters)
    if (isLoginCode(text)) {
      await handleLoginCode(ctx, text);
      return;
    }

    const user = await getUser(telegramId);

    // If no user exists, prompt them to start
    if (!user) {
      await ctx.reply(START_MESSAGES.BEGIN_JOURNEY);
      return;
    }

    // If onboarding complete, route to Questions Agent
    if (user.onboarding_step === "completed") {
      await ctx.reply(QUESTIONS_MESSAGES.THINKING, { reply_markup: menuButtons });

      try {
        const answer = await answerQuestion(telegramId, text);
        await ctx.reply(
          answer || QUESTIONS_MESSAGES.ERROR,
          { reply_markup: menuButtons }
        );
      } catch (error) {
        console.error("❌ Error answering question:", error);
        await ctx.reply(QUESTIONS_MESSAGES.ERROR, { reply_markup: menuButtons });
      }
      return;
    }

    // Handle timezone step separately (text-based, not number-based)
    if (user.onboarding_step === "timezone") {
      // User clicked "Enter manually instead" button
      if (text === TIMEZONE_MANUAL_BUTTON) {
        await ctx.reply(ONBOARDING_MESSAGES.TIMEZONE_MANUAL, {
          reply_markup: manualTimezoneKeyboard,
        });
        return;
      }

      // Validate and save timezone
      if (isValidTimezone(text)) {
        const updatedUser = await updateUser(telegramId, {
          timezone: text,
          onboarding_step: "completed",
        });

        if (updatedUser) {
          const weightDiff = (updatedUser.current_weight ?? 0) - (updatedUser.goal_weight ?? 0);
          const completionMessage = weightDiff > 0
            ? ONBOARDING_MESSAGES.COMPLETED_WITH_GOAL(
                updatedUser.first_name,
                updatedUser.current_weight!,
                updatedUser.goal_weight!,
                weightDiff
              )
            : ONBOARDING_MESSAGES.COMPLETED_WITHOUT_GOAL(
                updatedUser.first_name,
                updatedUser.current_weight!,
                updatedUser.goal_weight!
              );

          await ctx.reply(
            `${ONBOARDING_MESSAGES.TIMEZONE_DETECTED(text)}\n\n${completionMessage}`,
            { reply_markup: menuButtons }
          );
        }
      } else {
        await ctx.reply(ONBOARDING_MESSAGES.INVALID_TIMEZONE, {
          reply_markup: manualTimezoneKeyboard,
        });
      }
      return;
    }

    // Handle numeric onboarding steps (weight, goal, height)
    const validation = validateNumber(text);

    if (!validation.valid) {
      await ctx.reply(validation.error || TEXT_MESSAGES.INVALID_NUMBER);
      return;
    }

    const num = validation.value!;

    switch (user.onboarding_step) {
      case "weight": {
        const weightValidation = validateWeight(num);
        if (!weightValidation.valid) {
          await ctx.reply(weightValidation.error || TEXT_MESSAGES.INVALID_WEIGHT);
          return;
        }
        const updatedUser = await updateUser(telegramId, {
          current_weight: num,
          onboarding_step: "goal",
        });
        await logWeight(telegramId, num);

        if (updatedUser) {
          await sendOnboardingPrompt(ctx, updatedUser);
        }
        break;
      }
      case "goal": {
        const weightValidation = validateWeight(num);
        if (!weightValidation.valid) {
          await ctx.reply(weightValidation.error || TEXT_MESSAGES.INVALID_WEIGHT);
          return;
        }
        const updatedUser = await updateUser(telegramId, {
          goal_weight: num,
          onboarding_step: "height",
        });

        if (updatedUser) {
          await sendOnboardingPrompt(ctx, updatedUser);
        }
        break;
      }
      case "height": {
        const heightValidation = validateHeight(num);
        if (!heightValidation.valid) {
          await ctx.reply(heightValidation.error || TEXT_MESSAGES.INVALID_HEIGHT);
          return;
        }
        const updatedUser = await updateUser(telegramId, {
          height: num,
          onboarding_step: "timezone",
        });

        if (updatedUser) {
          await sendOnboardingPrompt(ctx, updatedUser);
        }
        break;
      }
    }
  } catch (error) {
    await handleError(ctx, error, "An error occurred while processing your message.");
  }
}
