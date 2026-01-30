import { Mastra } from "@mastra/core";
import { Observability } from "@mastra/observability";
import { OtelExporter } from "@mastra/otel-exporter";

import { foodAnalyzerAgent } from "./agents/food-analyzer";
import { insightsAgent } from "./agents/insights-agent";
import { dailySummaryAgent } from "./agents/daily-summary-agent";
import { questionsAgent } from "./agents/questions-agent";

// === OPIK CONFIGURATION ===
const opikApiKey = process.env.OPIK_API_KEY;
const opikWorkspace = process.env.OPIK_WORKSPACE || "default";
const opikProject = process.env.OPIK_PROJECT || "fasttrack-encode";
const opikEndpoint = "https://www.comet.com/opik/api/v1/private/otel";

console.log("📊 [Opik] Initializing...");
console.log("📊 [Opik] API Key:", opikApiKey ? `✓ Set (${opikApiKey.substring(0, 8)}...)` : "✗ MISSING");
console.log("📊 [Opik] Workspace:", opikWorkspace);
console.log("📊 [Opik] Project:", opikProject);

const opikExporter = opikApiKey
  ? new OtelExporter({
      provider: {
        custom: {
          endpoint: opikEndpoint,
          headers: {
            Authorization: opikApiKey,
            "Comet-Workspace": opikWorkspace,
            projectName: opikProject,
          },
          protocol: "http/json",
        },
      },
    })
  : undefined;

const observability = opikExporter
  ? new Observability({
      configs: {
        default: {
          serviceName: "fasttrack",
          exporters: [opikExporter],
        },
      },
    })
  : undefined;

export const mastra = new Mastra({
  agents: {
    foodAnalyzerAgent,
    insightsAgent,
    dailySummaryAgent,
    questionsAgent,
  },
  ...(observability && { observability }),
});
console.log("📊 [Opik] Mastra initialized", observability ? "with observability ✓" : "without observability");

export { foodAnalyzerAgent } from "./agents/food-analyzer";
export { insightsAgent } from "./agents/insights-agent";
export { dailySummaryAgent } from "./agents/daily-summary-agent";
export { questionsAgent } from "./agents/questions-agent";
