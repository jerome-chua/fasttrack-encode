import { Context } from "grammy";
import { menuButtons } from "../constants/keyboards";
import { LOGIN_MESSAGES } from "../constants/messages";
import { verifyLoginCode } from "../services/auth";

// Handle login code
export async function handleLoginCode(ctx: Context, code: string): Promise<void> {
  const telegramId = ctx.from?.id;
  const firstName = ctx.from?.first_name ?? "there";

  if (!telegramId) return;

  const result = await verifyLoginCode(code, telegramId, firstName);

  if (result.success) {
    await ctx.reply(
      LOGIN_MESSAGES.SUCCESS,
      { reply_markup: menuButtons }
    );
  } else {
    await ctx.reply(
      LOGIN_MESSAGES.INVALID_CODE(result.error || "Invalid code")
    );
  }
}
