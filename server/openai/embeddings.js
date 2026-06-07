import { getOpenAIClient } from "./client.js";

export async function createEmbedding(input) {
  const response = await getOpenAIClient().embeddings.create({
    model: process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",
    input
  });

  return response.data?.[0]?.embedding || [];
}