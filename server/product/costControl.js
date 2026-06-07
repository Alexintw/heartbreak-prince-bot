import { createHttpError } from "./permission.js";

const MAX_INPUT_CHARS = Number(process.env.MAX_INPUT_CHARS || 6000);

export function estimateInputTokens(text) {
  return Math.ceil(text.length / 2);
}

export function enforceCostBudget({ text }) {
  if (text.length > MAX_INPUT_CHARS) {
    throw createHttpError(413, `Input is too long. Please keep reflection under ${MAX_INPUT_CHARS} characters.`);
  }

  return {
    maxInputChars: MAX_INPUT_CHARS,
    inputChars: text.length,
    estimatedInputTokens: estimateInputTokens(text),
    modelCalls: 2
  };
}