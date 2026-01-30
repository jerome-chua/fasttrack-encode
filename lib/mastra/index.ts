import { Mastra } from "@mastra/core";
import { Observability } from "@mastra/observability";
import { OtelExporter } from "@mastra/otel-exporter";

import { foodAnalyzerAgent } from "./agents/food-analyzer";
import { insightsAgent } from "./agents/insights-agent";
import { dailySummaryAgent } from "./agents/daily-summary-agent";
import { questionsAgent } from "./agents/questions-agent";

const opikApiKey = process.env.OPIK_API_KEY;
const opikWorkspace = process.env.OPIK_WORKSPACE || "default";

const opikExporter = new OtelExporter({
  provider: {
    custom: {
      endpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
      headers: {
        Authorization: opikApiKey || "",
        "Comet-Workspace": opikWorkspace,
      },
      protocol: "http/protobuf",
    },
  },
  logLevel: "info",
});

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

export { foodAnalyzerAgent } from "./agents/food-analyzer";
export { insightsAgent } from "./agents/insights-agent";
export { dailySummaryAgent } from "./agents/daily-summary-agent";
export { questionsAgent } from "./agents/questions-agent";
