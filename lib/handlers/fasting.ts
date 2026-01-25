import { Context } from "grammy";
import { getActiveFast, startFast, endFast } from "../supabase";
import { menuKeyboard } from "../constants/keyboards";
import { FASTING_MESSAGES } from "../constants/messages";
import { formatFastDuration } from "../utils/formatting";
import { handleError } from "../utils/error-handler";

export async function handleBreakFast(ctx: Context): Promise<void> {
  const telegramId = ctx.from?.id;
  if (!telegramId) return;

  try {
    const activeFast = await getActiveFast(telegramId);

    if (activeFast) {
      // End the active fast
      const endedFast = await endFast(telegramId);
      if (endedFast) {
        const duration = formatFastDuration(endedFast.started_at);
        await ctx.reply(
          FASTING_MESSAGES.FAST_ENDED(duration),
          { reply_markup: menuKeyboard }
        );
      } else {
        await ctx.reply(
          FASTING_MESSAGES.END_ERROR,
          { reply_markup: menuKeyboard }
        );
      }
    } else {
      // Start a new fast
      const newFast = await startFast(telegramId);
      if (newFast) {
        await ctx.reply(
          FASTING_MESSAGES.FAST_STARTED,
          { reply_markup: menuKeyboard }
        );
      } else {
        await ctx.reply(
          FASTING_MESSAGES.START_ERROR,
          { reply_markup: menuKeyboard }
        );
      }
    }
  } catch (error) {
    await handleError(ctx, error, "An error occurred while managing your fast.");
  }
}
