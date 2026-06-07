import { getOpenAIClient } from "./client.js";

export async function createTextResponse(prompt) {
  const response = await getOpenAIClient().responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.5",
    input: prompt
  });

  return response.output_text || "";
}