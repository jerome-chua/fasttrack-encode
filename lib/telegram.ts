import { Bot, Keyboard } from "grammy";

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error("TELEGRAM_BOT_TOKEN environment variable is not set");
}

export const bot = new Bot(token);

// Menu keyboard
const menuKeyboard = new Keyboard()
  .text("🍽️ Food Log").text("⏰ Break Fast").row()
  .text("📊 Get Insights").text("❓ Ask Questions")
  .resized()
  .persistent();

// Handle /start command
bot.command("start", async (ctx) => {
  const firstName = ctx.from?.first_name ?? "there";
  await ctx.reply(
    `Hi ${firstName}! Welcome to FastTrack, where we'll hit your weight goals together using principles from The Obesity Code by Dr. Jason Fung.\n\nChoose an option below to get started:`,
    { reply_markup: menuKeyboard }
  );
});

// Handle menu button: Food Log
bot.hears("🍽️ Food Log", async (ctx) => {
  await ctx.reply(
    "📸 Send me a photo of your meal and I'll estimate the calories for you!",
    { reply_markup: menuKeyboard }
  );
});

// Handle menu button: Break Fast
bot.hears("⏰ Break Fast", async (ctx) => {
  await ctx.reply(
    "⏰ Ready to break your fast? Let me record the time.\n\nYour fast has been logged!",
    { reply_markup: menuKeyboard }
  );
});

// Handle menu button: Get Insights
bot.hears("📊 Get Insights", async (ctx) => {
  await ctx.reply(
    "📊 Here are your insights based on your weight loss goals:\n\n• Keep tracking your meals consistently\n• Aim for 16-hour fasting windows\n• Stay hydrated during fasting periods",
    { reply_markup: menuKeyboard }
  );
});

// Handle menu button: Ask Questions
bot.hears("❓ Ask Questions", async (ctx) => {
  await ctx.reply(
    "❓ Ask me anything about intermittent fasting, nutrition, or your weight loss journey!",
    { reply_markup: menuKeyboard }
  );
});

// Handle other text messages
bot.on("message:text", async (ctx) => {
  await ctx.reply(
    `You said: ${ctx.message.text}\n\nUse the menu buttons below to navigate.`,
    { reply_markup: menuKeyboard }
  );
});
