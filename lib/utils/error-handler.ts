import { Context } from "grammy";
import { Keyboard } from "grammy";
import { menuButtons } from "../constants/keyboards";

// Handle errors and send user-friendly messages
export async function handleError(
  ctx: Context,
  error: unknown,
  defaultMessage: string
): Promise<void> {
  console.error("❌ Error:", error);
  
  const errorMessage = error instanceof Error 
    ? error.message 
    : typeof error === "string" 
    ? error 
    : defaultMessage;

  await ctx.reply(
    `Sorry, something went wrong: ${errorMessage}`,
    { reply_markup: menuButtons }
  );
}

// Handle database errors and return user-friendly message
export function handleDatabaseError(error: unknown): string {
  if (error instanceof Error) {
    console.error("Database error:", error.message);
    return "A database error occurred. Please try again.";
  }
  return "An unexpected error occurred. Please try again.";
}

// Handle errors with custom keyboard
export async function handleErrorWithKeyboard(
  ctx: Context,
  error: unknown,
  defaultMessage: string,
  keyboard?: Keyboard
): Promise<void> {
  console.error("❌ Error:", error);
  
  const errorMessage = error instanceof Error 
    ? error.message 
    : typeof error === "string" 
    ? error 
    : defaultMessage;

  await ctx.reply(
    `Sorry, something went wrong: ${errorMessage}`,
    { reply_markup: keyboard || menuButtons }
  );
}
