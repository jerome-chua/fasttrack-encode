// Onboarding messages
export const ONBOARDING_MESSAGES = {
  WEIGHT: (firstName: string) =>
    `Hi ${firstName}! Welcome to FastTrack, where we'll hit your weight goals together using principles from The Obesity Code by Dr. Jason Fung.\n\nLet's get you set up! First, what's your current weight in kg?\n\n(Just type a number, e.g., 75)`,
  GOAL: "Great! Now, what's your goal weight in kg?\n\n(Just type a number, e.g., 68)",
  HEIGHT: "Almost done! What's your height in cm?\n\n(Just type a number, e.g., 170)",
  COMPLETED: "You're all set! Choose an option below to get started:",
  COMPLETED_WITH_GOAL: (firstName: string, currentWeight: number, goalWeight: number, weightDiff: number) =>
    `You're all set, ${firstName}!\n\nCurrent: ${currentWeight} kg\nGoal: ${goalWeight} kg\nTo lose: ${weightDiff.toFixed(1)} kg\n\nLet's make it happen! Choose an option below:`,
  COMPLETED_WITHOUT_GOAL: (firstName: string, currentWeight: number, goalWeight: number) =>
    `You're all set, ${firstName}!\n\nCurrent: ${currentWeight} kg\nGoal: ${goalWeight} kg\n\nLet's get started! Choose an option below:`,
} as const;

// Start command messages
export const START_MESSAGES = {
  WELCOME_BACK: (firstName: string) =>
    `Welcome back, ${firstName}! Ready to continue your fasting journey?\n\nChoose an option below:`,
  IDENTIFICATION_ERROR: "Sorry, I couldn't identify you. Please try again.",
  SETUP_ERROR: "Sorry, there was an error setting up your account. Please try again.",
  BEGIN_JOURNEY: "Type /start to begin your FastTrack journey!",
} as const;

// Menu button messages
export const MENU_MESSAGES = {
  FOOD_LOG: "📸 Send me a photo of your meal and I'll estimate the calories for you!",
  GET_INSIGHTS: "📊 Here are your insights based on your weight loss goals:\n\n• Keep tracking your meals consistently\n• Aim for 16-hour fasting windows\n• Stay hydrated during fasting periods",
  ASK_QUESTIONS: "❓ Ask me anything about intermittent fasting, nutrition, or your weight loss journey!",
} as const;

// Fasting messages
export const FASTING_MESSAGES = {
  FAST_ENDED: (duration: string) =>
    `⏰ Fast ended!\n\nYou fasted for ${duration}. Great job!\n\n📸 Want to log your first meal? Send me a photo!`,
  FAST_STARTED: `🕐 Fast started!\n\nI've recorded the start time. Tap "⏰ Break Fast" again when you're ready to eat.\n\nGood luck! Remember: staying hydrated helps.`,
  END_ERROR: "Sorry, there was an error ending your fast. Please try again.",
  START_ERROR: "Sorry, there was an error starting your fast. Please try again.",
} as const;

// Food logging messages
export const FOOD_LOGGING_MESSAGES = {
  ANALYZING: "🔍 Analyzing your meal...",
  ANALYSIS_ERROR: "Sorry, I had trouble analyzing that photo. Please try again.",
  MEAL_LOGGED: "✅ Meal logged!",
  ONBOARDING_REQUIRED: "Please complete onboarding first. Type /start to begin.",
} as const;

// Login messages
export const LOGIN_MESSAGES = {
  SUCCESS: "✅ Login successful!\n\nYou can now access the FastTrack dashboard in your browser.",
  INVALID_CODE: (error: string) =>
    `❌ ${error}.\n\nPlease check the code and try again, or request a new one from the login page.`,
} as const;

// Insights messages
export const INSIGHTS_MESSAGES = {
  GENERATING: "🔍 Analyzing your data to generate personalized insights...\n\nThis may take a moment.",
  GENERATION_ERROR: "Sorry, I had trouble generating your insights. Please try again in a moment.",
  ONBOARDING_REQUIRED: "Please complete onboarding first to get personalized insights. Type /start to begin.",
} as const;

// Text message responses
export const TEXT_MESSAGES = {
  GENERAL_RESPONSE: "I received your message! Use the menu below to log food, track fasting, or get insights.",
  INVALID_NUMBER: "Please enter a valid positive number.",
  INVALID_WEIGHT: "Please enter a weight between 20 and 300 kg.",
  INVALID_HEIGHT: "Please enter a height between 100 and 250 cm.",
} as const;
