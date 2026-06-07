export const reflectionResponseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    output: {
      type: "string",
      description: "The final Traditional Chinese reflection response."
    },
    safetyNotes: {
      type: "string",
      description: "Short safety summary for internal review."
    }
  },
  required: ["output", "safetyNotes"]
};

export function getReflectionResponseFormat() {
  return {
    type: "json_schema",
    name: "reflection_response",
    schema: reflectionResponseSchema,
    strict: true
  };
}