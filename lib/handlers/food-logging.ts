import { Context } from "grammy";
import { getUser } from "../supabase";
import { menuButtons } from "../constants/keyboards";
import { FOOD_LOGGING_MESSAGES } from "../constants/messages";
import { getLargestPhoto, downloadPhotoFromTelegram } from "../utils/photo-processing";
import { analyzeFoodPhoto } from "../services/food-analyzer";

// Handle photo messages (food logging)
export async function handlePhotoMessage(
  ctx: Context,
  processedMessages: Set<number>
): Promise<void> {
  if (!ctx.message || !ctx.message.photo) {
    return;
  }

  const messageId = ctx.message.message_id;

  // Skip if we've already processed this message (Telegram sends multiple photo sizes with same message_id)
  if (processedMessages.has(messageId)) {
    console.log("⏭️ Skipping duplicate photo message:", messageId);
    return;
  }

  // Mark this message as processed
  processedMessages.add(messageId);

  console.log("📸 Photo received from user:", ctx.from?.id, "message_id:", messageId);

  const telegramId = ctx.from?.id;
  if (!telegramId) return;

  try {
    const user = await getUser(telegramId);
    console.log("👤 User lookup:", user?.telegram_id, "onboarding:", user?.onboarding_step);

    if (!user || user.onboarding_step !== "completed") {
      await ctx.reply(FOOD_LOGGING_MESSAGES.ONBOARDING_REQUIRED);
      return;
    }

    await ctx.reply(FOOD_LOGGING_MESSAGES.ANALYZING, { reply_markup: menuButtons });
    console.log("🔍 Starting food analysis...");

    // Get the largest photo (best quality)
    const photos = ctx.message.photo;
    const photo = getLargestPhoto(photos);

    // Download and convert photo
    const { base64, mimeType } = await downloadPhotoFromTelegram(photo.file_id, ctx.api);

    // Analyze the food photo
    const agentResponse = await analyzeFoodPhoto(base64, mimeType, telegramId);

    await ctx.reply(
      agentResponse || FOOD_LOGGING_MESSAGES.MEAL_LOGGED,
      { reply_markup: menuButtons }
    );
  } catch (error) {
    console.error("❌ Error analyzing food photo:", error);
    await ctx.reply(
      FOOD_LOGGING_MESSAGES.ANALYSIS_ERROR,
      { reply_markup: menuButtons }
    );
  }
}
