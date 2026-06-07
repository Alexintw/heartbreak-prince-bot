export async function retrieveReflectionContext({ text, styleId }) {
  return {
    query: text.slice(0, 200),
    styleId,
    documents: [],
    citations: [],
    enabled: false,
    note: "RAG is reserved for future personal knowledge base or journal memory retrieval."
  };
}