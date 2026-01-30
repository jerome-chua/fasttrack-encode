import { Mastra } from "@mastra/core";
import { Observability } from "@mastra/observability";
import { OtelExporter } from "@mastra/otel-exporter";

import { foodAnalyzerAgent } from "./agents/food-analyzer";
import { insightsAgent } from "./agents/insights-agent";
import { dailySummaryAgent } from "./agents/daily-summary-agent";
import { questionsAgent } from "./agents/questions-agent";

const opikApiKey = process.env.OPIK_API_KEY;
const opikWorkspace = process.env.OPIK_WORKSPACE || "default";
const opikProject = process.env.OPIK_PROJECT || "fasttrack-encode";
const opikEndpoint = "https://www.comet.com/opik/api/v1/private/otel/v1/traces";

// === OPIK CONFIGURATION LOGS ===
console.log("📊 [Opik] Initializing observability...");
console.log("📊 [Opik] API Key:", opikApiKey ? `✓ Set (${opikApiKey.substring(0, 8)}...)` : "✗ MISSING");
console.log("📊 [Opik] Workspace:", opikWorkspace);
console.log("📊 [Opik] Project:", opikProject);
console.log("📊 [Opik] Endpoint:", opikEndpoint);

if (!opikApiKey) {
  console.warn("⚠️ [Opik] OPIK_API_KEY not set - traces will not be sent");
}

const opikExporter = new OtelExporter({
  provider: {
    custom: {
      endpoint: opikEndpoint,
      headers: {
        Authorization: opikApiKey || "",
        "Comet-Workspace": opikWorkspace,
        projectName: opikProject,
      },
      protocol: "http/json",
    },
  },
  logLevel: "debug",
});
console.log("📊 [Opik] OtelExporter created");

const observability = new Observability({
  configs: {
    default: {
      serviceName: "fasttrack",
      exporters: [opikExporter],
    },
  },
});
console.log("📊 [Opik] Observability instance created with serviceName: fasttrack");

export const mastra = new Mastra({
  agents: {
    foodAnalyzerAgent,
    insightsAgent,
    dailySummaryAgent,
    questionsAgent,
  },
  observability,
});
console.log("📊 [Opik] Mastra initialized with observability ✓");

export { foodAnalyzerAgent } from "./agents/food-analyzer";
export { insightsAgent } from "./agents/insights-agent";
export { dailySummaryAgent } from "./agents/daily-summary-agent";
export { questionsAgent } from "./agents/questions-agent";
