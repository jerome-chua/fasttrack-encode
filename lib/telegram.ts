import { Bot } from "grammy";
import { handleStartCommand } from "./handlers/start";
import { handlePhotoMessage } from "./handlers/food-logging";
import { handleTextMessage } from "./handlers/text";

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error("TELEGRAM_BOT_TOKEN environment variable is not set");
}

export const bot = new Bot(token);

const processedMessages = new Set<number>();
const MESSAGE_CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

setInterval(() => {
  processedMessages.clear();
}, MESSAGE_CLEANUP_INTERVAL);

// Register command handlers
bot.command("start", handleStartCommand);

// Register message handlers
bot.on("message:photo", (ctx) => handlePhotoMessage(ctx, processedMessages));
bot.on("message:text", handleTextMessage);
