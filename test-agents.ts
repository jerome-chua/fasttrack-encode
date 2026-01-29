/**
 * Test script for Mastra agents
 * Run with: npx tsx test-agents.ts
 */

// Load environment variables from .env.local
import { config } from "dotenv";
config({ path: ".env.local" });

import { dailySummaryAgent, insightsAgent, questionsAgent } from "./lib/mastra/index";

async function testDailySummaryAgent() {
  console.log("\n=== Testing Daily Summary Agent ===\n");

  try {
    const response = await dailySummaryAgent.generate(
      "Generate today's daily summary for telegram_id: 123456789. Use the tools to gather their data.",
      { maxSteps: 5 }
    );

    console.log("Response:", response.text);
    console.log("\nSteps taken:", response.steps?.length || 0);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function testQuestionsAgent() {
  console.log("\n=== Testing Questions Agent ===\n");

  try {
    const response = await questionsAgent.generate(
      "User telegram_id: 123456789\n\nQuestion: What is intermittent fasting and how does it help with weight loss?",
      { maxSteps: 5 }
    );

    console.log("Response:", response.text);
    console.log("\nSteps taken:", response.steps?.length || 0);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function main() {
  console.log("Starting agent tests...\n");
  console.log("Note: Some tests may fail if the telegram_id doesn't exist in the database.\n");

  // Test the questions agent with a general knowledge question (doesn't need DB)
  await testQuestionsAgent();

  // Test daily summary (may fail if user doesn't exist)
  // await testDailySummaryAgent();

  console.log("\n=== Tests Complete ===");
  console.log("\nCheck your Opik dashboard for traces: https://www.comet.com/opik");
}

main().catch(console.error);
