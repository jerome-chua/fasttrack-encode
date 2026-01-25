import { Keyboard } from "grammy";

// Menu keyboard (shown after onboarding complete)
export const menuKeyboard = new Keyboard()
  .text("🍽️ Food Log").text("⏰ Break Fast").row()
  .text("📊 Get Insights").text("❓ Ask Questions")
  .resized()
  .persistent();
