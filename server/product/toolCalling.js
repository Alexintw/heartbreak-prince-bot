import { getToolDefinitions, hasToolCallingEnabled } from "../openai/functionCalling.js";

export function buildToolPlan(intentResult) {
  return {
    enabled: hasToolCallingEnabled() && intentResult.needsToolCalling,
    tools: getToolDefinitions(),
    calls: []
  };
}