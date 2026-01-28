import { Keyboard } from "grammy";

export const menuButtons = new Keyboard()
  .text("🤳🏼 Log Food").text("☀️ Daily Summary").row()
  .text("🧠 Get Insights").text("💬 Ask Questions")
  .resized()
  .persistent();

export const locationRequestKeyboard = new Keyboard()
  .requestLocation("📍 Share my location")
  .row()
  .text("Enter manually instead")
  .resized()
  .oneTime();

export const manualTimezoneKeyboard = new Keyboard()
  .text("Asia/Singapore").text("Asia/Tokyo").row()
  .text("America/New_York").text("America/Los_Angeles").row()
  .text("Europe/London").text("UTC")
  .resized()
  .oneTime();
