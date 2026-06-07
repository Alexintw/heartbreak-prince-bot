import OpenAI from "openai";

let openaiClient = null;

export function getOpenAIClient() {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  return openaiClient;
}

export function hasUsableOpenAIKey() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  return Boolean(
    apiKey &&
      apiKey !== "your_api_key_here" &&
      /^[\x20-\x7E]+$/.test(apiKey)
  );
}