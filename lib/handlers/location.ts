import { Context } from "grammy";
import { getUser, updateUser } from "../supabase";
import { menuButtons } from "../constants/keyboards";
import { ONBOARDING_MESSAGES } from "../constants/messages";
import { getTimezoneFromCoordinates } from "../utils/timezone";
import { handleError } from "../utils/error-handler";

export async function handleLocationMessage(ctx: Context): Promise<void> {
  const location = ctx.message?.location;
  if (!location) return;

  const telegramId = ctx.from?.id;
  if (!telegramId) return;

  try {
    const user = await getUser(telegramId);

    // Only process location during timezone onboarding step
    if (!user || user.onboarding_step !== "timezone") {
      return;
    }

    const timezone = getTimezoneFromCoordinates(location.latitude, location.longitude);

    const updatedUser = await updateUser(telegramId, {
      timezone,
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
        `${ONBOARDING_MESSAGES.TIMEZONE_DETECTED(timezone)}\n\n${completionMessage}`,
        { reply_markup: menuButtons }
      );
    }
  } catch (error) {
    await handleError(ctx, error, "An error occurred while processing your location.");
  }
}
