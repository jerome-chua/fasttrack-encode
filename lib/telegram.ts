import { Bot, Keyboard } from "grammy";
import { InMemoryRunner } from "@google/adk";
import {
  getUser,
  createUser,
  updateUser,
  logWeight,
  getActiveFast,
  startFast,
  endFast,
  User,
} from "./supabase";
import { foodAnalyzerAgent } from "./agents/food-analyzer";

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  throw new Error("TELEGRAM_BOT_TOKEN environment variable is not set");
}

export const bot = new Bot(token);

// Menu keyboard (shown after onboarding complete)
const menuKeyboard = new Keyboard()
  .text("🍽️ Food Log").text("⏰ Break Fast").row()
  .text("📊 Get Insights").text("❓ Ask Questions")
  .resized()
  .persistent();

// Helper to format fasting duration
function formatFastDuration(startedAt: string): string {
  const start = new Date(startedAt);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

// Handle /start command
bot.command("start", async (ctx) => {
  const telegramId = ctx.from?.id;
  const firstName = ctx.from?.first_name ?? "there";

  if (!telegramId) {
    await ctx.reply("Sorry, I couldn't identify you. Please try again.");
    return;
  }

  // Check if user exists
  let user = await getUser(telegramId);

  if (user && user.onboarding_step === "completed") {
    // Returning user - show menu
    await ctx.reply(
      `Welcome back, ${firstName}! Ready to continue your fasting journey?\n\nChoose an option below:`,
      { reply_markup: menuKeyboard }
    );
    return;
  }

  if (!user) {
    // New user - create and start onboarding
    user = await createUser(telegramId, firstName);
    if (!user) {
      await ctx.reply("Sorry, there was an error setting up your account. Please try again.");
      return;
    }
  }

  // Start/continue onboarding based on current step
  await sendOnboardingPrompt(ctx, user);
});

// Send the appropriate onboarding prompt based on user's step
async function sendOnboardingPrompt(ctx: any, user: User) {
  const firstName = user.first_name;

  switch (user.onboarding_step) {
    case "weight":
      await ctx.reply(
        `Hi ${firstName}! Welcome to FastTrack, where we'll hit your weight goals together using principles from The Obesity Code by Dr. Jason Fung.\n\nLet's get you set up! First, what's your current weight in kg?\n\n(Just type a number, e.g., 75)`,
        { reply_markup: { remove_keyboard: true } }
      );
      break;
    case "goal":
      await ctx.reply(
        `Great! Now, what's your goal weight in kg?\n\n(Just type a number, e.g., 68)`,
        { reply_markup: { remove_keyboard: true } }
      );
      break;
    case "height":
      await ctx.reply(
        `Almost done! What's your height in cm?\n\n(Just type a number, e.g., 170)`,
        { reply_markup: { remove_keyboard: true } }
      );
      break;
    case "completed":
      await ctx.reply(
        `You're all set! Choose an option below to get started:`,
        { reply_markup: menuKeyboard }
      );
      break;
  }
}

// Handle menu button: Food Log
bot.hears("🍽️ Food Log", async (ctx) => {
  await ctx.reply(
    "📸 Send me a photo of your meal and I'll estimate the calories for you!",
    { reply_markup: menuKeyboard }
  );
});

// Handle menu button: Break Fast
bot.hears("⏰ Break Fast", async (ctx) => {
  const telegramId = ctx.from?.id;
  if (!telegramId) return;

  const activeFast = await getActiveFast(telegramId);

  if (activeFast) {
    // End the active fast
    const endedFast = await endFast(telegramId);
    if (endedFast) {
      const duration = formatFastDuration(endedFast.started_at);
      await ctx.reply(
        `⏰ Fast ended!\n\nYou fasted for ${duration}. Great job!\n\n📸 Want to log your first meal? Send me a photo!`,
        { reply_markup: menuKeyboard }
      );
    } else {
      await ctx.reply(
        "Sorry, there was an error ending your fast. Please try again.",
        { reply_markup: menuKeyboard }
      );
    }
  } else {
    // Start a new fast
    const newFast = await startFast(telegramId);
    if (newFast) {
      await ctx.reply(
        `🕐 Fast started!\n\nI've recorded the start time. Tap "⏰ Break Fast" again when you're ready to eat.\n\nGood luck! Remember: staying hydrated helps.`,
        { reply_markup: menuKeyboard }
      );
    } else {
      await ctx.reply(
        "Sorry, there was an error starting your fast. Please try again.",
        { reply_markup: menuKeyboard }
      );
    }
  }
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

// Handle photo messages (food logging)
bot.on("message:photo", async (ctx) => {
  console.log("📸 Photo received from user:", ctx.from?.id);

  const telegramId = ctx.from?.id;
  if (!telegramId) return;

  const user = await getUser(telegramId);
  console.log("👤 User lookup:", user?.telegram_id, "onboarding:", user?.onboarding_step);

  if (!user || user.onboarding_step !== "completed") {
    await ctx.reply("Please complete onboarding first. Type /start to begin.");
    return;
  }

  await ctx.reply("🔍 Analyzing your meal...", { reply_markup: menuKeyboard });
  console.log("🔍 Starting food analysis...");

  try {
    // Get the largest photo (best quality)
    const photos = ctx.message.photo;
    const photo = photos[photos.length - 1];
    const file = await ctx.api.getFile(photo.file_id);
    const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;

    // Download the image
    console.log("📥 Downloading image from:", fileUrl);
    const response = await fetch(fileUrl);
    const arrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = file.file_path?.endsWith(".png") ? "image/png" : "image/jpeg";
    console.log("✅ Image downloaded, size:", arrayBuffer.byteLength, "bytes, type:", mimeType);

    // Run the food analyzer agent
    console.log("🤖 Starting ADK agent...");
    const runner = new InMemoryRunner({
      agent: foodAnalyzerAgent,
      appName: "fasttrack",
    });

    // Create a session for this user
    const userId = telegramId.toString();
    const session = await runner.sessionService.createSession({
      appName: "fasttrack",
      userId,
    });

    // Build the message with image
    const newMessage = {
      role: "user" as const,
      parts: [
        {
          inlineData: {
            mimeType,
            data: base64Image,
          },
        },
        {
          text: `Analyze this food photo and log it for telegram_id: ${telegramId}`,
        },
      ],
    };

    // Run the agent and collect events
    let agentResponse = "";
    console.log("🚀 Running agent for session:", session.id);
    for await (const event of runner.runAsync({
      userId,
      sessionId: session.id,
      newMessage,
    })) {
      console.log("📨 Event received:", event.author, event.content?.parts?.length, "parts");
      // Extract text from model responses
      if (event.content?.parts) {
        for (const part of event.content.parts) {
          if ("text" in part && part.text) {
            agentResponse += part.text;
          }
        }
      }
    }

    console.log("✅ Agent response:", agentResponse.substring(0, 100) + "...");
    await ctx.reply(agentResponse || "✅ Meal logged!", { reply_markup: menuKeyboard });
  } catch (error) {
    console.error("❌ Error analyzing food photo:", error);
    await ctx.reply(
      "Sorry, I had trouble analyzing that photo. Please try again.",
      { reply_markup: menuKeyboard }
    );
  }
});

// Handle other text messages (onboarding flow)
bot.on("message:text", async (ctx) => {
  const telegramId = ctx.from?.id;
  const text = ctx.message.text.trim();

  if (!telegramId) return;

  const user = await getUser(telegramId);

  // If no user exists, prompt them to start
  if (!user) {
    await ctx.reply("Type /start to begin your FastTrack journey!");
    return;
  }

  // If onboarding complete, treat as a question
  if (user.onboarding_step === "completed") {
    await ctx.reply(
      "I received your message! Use the menu below to log food, track fasting, or get insights.",
      { reply_markup: menuKeyboard }
    );
    return;
  }

  // Handle onboarding steps
  const num = parseFloat(text);

  if (isNaN(num) || num <= 0) {
    await ctx.reply("Please enter a valid positive number.");
    return;
  }

  switch (user.onboarding_step) {
    case "weight": {
      if (num < 20 || num > 300) {
        await ctx.reply("Please enter a weight between 20 and 300 kg.");
        return;
      }
      // Save weight and log it
      const updatedUser = await updateUser(telegramId, {
        current_weight: num,
        onboarding_step: "goal",
      });
      await logWeight(telegramId, num);

      if (updatedUser) {
        await sendOnboardingPrompt(ctx, updatedUser);
      }
      break;
    }
    case "goal": {
      if (num < 20 || num > 300) {
        await ctx.reply("Please enter a weight between 20 and 300 kg.");
        return;
      }
      const updatedUser = await updateUser(telegramId, {
        goal_weight: num,
        onboarding_step: "height",
      });

      if (updatedUser) {
        await sendOnboardingPrompt(ctx, updatedUser);
      }
      break;
    }
    case "height": {
      if (num < 100 || num > 250) {
        await ctx.reply("Please enter a height between 100 and 250 cm.");
        return;
      }
      const updatedUser = await updateUser(telegramId, {
        height: num,
        onboarding_step: "completed",
      });

      if (updatedUser) {
        const weightDiff = (updatedUser.current_weight ?? 0) - (updatedUser.goal_weight ?? 0);
        const message = weightDiff > 0
          ? `You're all set, ${updatedUser.first_name}!\n\nCurrent: ${updatedUser.current_weight} kg\nGoal: ${updatedUser.goal_weight} kg\nTo lose: ${weightDiff.toFixed(1)} kg\n\nLet's make it happen! Choose an option below:`
          : `You're all set, ${updatedUser.first_name}!\n\nCurrent: ${updatedUser.current_weight} kg\nGoal: ${updatedUser.goal_weight} kg\n\nLet's get started! Choose an option below:`;

        await ctx.reply(message, { reply_markup: menuKeyboard });
      }
      break;
    }
  }
});
