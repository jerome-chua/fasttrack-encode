import { Keyboard } from "grammy";

export const menuButtons = new Keyboard()
  .text("🤳🏼 Log Food").text("☀️ Daily Summary").row()
  .text("🧠 Get Insights").text("💬 Ask Questions")
  .resized()
  .persistent();
