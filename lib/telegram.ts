import { Bot } from "grammy";

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error("TELEGRAM_BOT_TOKEN environment variable is not set");
}

export const bot = new Bot(token);

// Handle /start command
bot.command("start", async (ctx) => {
  await ctx.reply(
    "Hi there! Welcome to FastTrack, where we'll hit your weight goals together using principles from The Obesity Code by Dr. Jason Fung."
  );
});

// Echo all other messages
bot.on("message:text", async (ctx) => {
  await ctx.reply(`You said: ${ctx.message.text}`);
});
