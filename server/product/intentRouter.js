export function routeIntent({ text, purpose }) {
  const trimmedText = text.trim();

  return {
    intent: "personal_reflection",
    purpose,
    confidence: trimmedText.length > 0 ? 0.95 : 0,
    needsRag: false,
    needsToolCalling: false
  };
}