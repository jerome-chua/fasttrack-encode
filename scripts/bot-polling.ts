import { bot } from "../lib/telegram";

// Start bot with long polling (for local development)
bot.start({
  onStart: (botInfo) => {
    console.log(`🤖 Bot @${botInfo.username} started with polling`);
  },
});

console.log("Starting bot in polling mode...");
