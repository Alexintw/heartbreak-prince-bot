export function getVectorStoreAdapter() {
  return {
    name: "vector_store",
    enabled: Boolean(process.env.VECTOR_STORE_URL),
    connectionUrl: process.env.VECTOR_STORE_URL || null,
    embeddingModel: process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small"
  };
}