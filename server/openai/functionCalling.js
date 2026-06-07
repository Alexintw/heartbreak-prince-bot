export const availableTools = [];

export function getToolDefinitions() {
  return availableTools;
}

export function hasToolCallingEnabled() {
  return availableTools.length > 0;
}