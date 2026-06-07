import { createHttpError } from "./permission.js";

function getMaxInputChars() {
  return Number(process.env.MAX_INPUT_CHARS || 6000);
}

export function estimateInputTokens(text) {
  return Math.ceil(text.length / 2);
}

export function enforceCostBudget({ text }) {
  const maxInputChars = getMaxInputChars();

  if (text.length > maxInputChars) {
    throw createHttpError(413, `Input is too long. Please keep reflection under ${maxInputChars} characters.`);
  }

  return {
    maxInputChars,
    inputChars: text.length,
    estimatedInputTokens: estimateInputTokens(text),
    modelCalls: 2
  };
}