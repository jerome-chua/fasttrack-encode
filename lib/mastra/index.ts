/**
 * Mastra Configuration for FastTrack
 *
 * This file initializes Mastra with all agents and Opik observability.
 *
 * Required environment variables:
 * - GOOGLE_GENERATIVE_AI_API_KEY: Your Gemini API key
 * - OPIK_API_KEY: Your Opik/Comet API key
 * - OPIK_WORKSPACE: Your Opik workspace name (default: "default")
 */

import { Mastra } from "@mastra/core";
import { Observability } from "@mastra/observability";
import { OtelExporter } from "@mastra/otel-exporter";

// Import agents
import { foodAnalyzerAgent } from "./agents/food-analyzer";
import { insightsAgent } from "./agents/insights-agent";
import { dailySummaryAgent } from "./agents/daily-summary-agent";
import { questionsAgent } from "./agents/questions-agent";

// Opik OTLP configuration
const opikApiKey = process.env.OPIK_API_KEY;
const opikWorkspace = process.env.OPIK_WORKSPACE || "default";

// Create OtelExporter for Opik
const opikExporter = new OtelExporter({
  provider: {
    custom: {
      endpoint: "https://www.comet.com/opik/api/v1/private/otel",
      headers: {
        Authorization: opikApiKey || "",
        "Comet-Workspace": opikWorkspace,
      },
      protocol: "http/protobuf",
    },
  },
  logLevel: "info",
});

// Create observability instance
const observability = new Observability({
  configs: {
    default: {
      serviceName: "fasttrack",
      exporters: [opikExporter],
    },
  },
});

export const mastra = new Mastra({
  agents: {
    foodAnalyzerAgent,
    insightsAgent,
    dailySummaryAgent,
    questionsAgent,
  },
  observability,
});

// Export individual agents for direct access
export { foodAnalyzerAgent } from "./agents/food-analyzer";
export { insightsAgent } from "./agents/insights-agent";
export { dailySummaryAgent } from "./agents/daily-summary-agent";
export { questionsAgent } from "./agents/questions-agent";
