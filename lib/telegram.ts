import { Bot } from "grammy";
import { handleStartCommand } from "./handlers/start";
import {
  handleFoodLogButton,
  handleGetInsightsButton,
  handleAskQuestionsButton,
} from "./handlers/menu";
import { handleBreakFast } from "./handlers/fasting";
import { handlePhotoMessage } from "./handlers/food-logging";
import { handleTextMessage } from "./handlers/text";

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error("TELEGRAM_BOT_TOKEN environment variable is not set");
}

export const bot = new Bot(token);

// Track processed message IDs to prevent duplicate processing
// Telegram sends multiple photo sizes, but they all share the same message_id
const processedMessages = new Set<number>();
const MESSAGE_CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Clean up old message IDs periodically to prevent memory leaks
setInterval(() => {
  processedMessages.clear();
}, MESSAGE_CLEANUP_INTERVAL);

// Register command handlers
bot.command("start", handleStartCommand);

// Register menu button handlers
bot.hears("🍽️ Food Log", handleFoodLogButton);
bot.hears("⏰ Break Fast", handleBreakFast);
bot.hears("📊 Get Insights", handleGetInsightsButton);
bot.hears("❓ Ask Questions", handleAskQuestionsButton);

// Register message handlers
bot.on("message:photo", (ctx) => handlePhotoMessage(ctx, processedMessages));
bot.on("message:text", handleTextMessage);
