export function createHttpError(statusCode, message, details = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.details = details;
  return error;
}

export function validateReflectionRequest(body, styleCards) {
  const {
    styleId,
    secondaryStyleId = null,
    intensity = 3,
    purpose = "reflection",
    text
  } = body;

  if (!styleId || typeof text !== "string" || text.trim().length === 0) {
    throw createHttpError(400, "styleId and text are required.");
  }

  if (!styleCards[styleId]) {
    throw createHttpError(404, "Primary style not found.");
  }

  if (secondaryStyleId && secondaryStyleId !== styleId && !styleCards[secondaryStyleId]) {
    throw createHttpError(404, "Secondary style not found.");
  }

  if (purpose !== "reflection") {
    throw createHttpError(400, "Unsupported purpose.");
  }

  return {
    styleId,
    secondaryStyleId: secondaryStyleId && secondaryStyleId !== styleId ? secondaryStyleId : null,
    intensity,
    purpose,
    text: text.trim()
  };
}