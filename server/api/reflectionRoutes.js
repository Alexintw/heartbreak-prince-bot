import { Router } from "express";
import { styleCards } from "../styleCards.js";
import { validateReflectionRequest } from "../product/permission.js";
import { generateReflectionResponse } from "../product/reflectionPipeline.js";

export const reflectionRouter = Router();

reflectionRouter.get("/styles", (req, res) => {
  const styles = Object.entries(styleCards).map(([id, card]) => ({
    id,
    buttonLabel: card.buttonLabel,
    displayName: card.displayName,
    positioning: card.positioning
  }));

  res.json({ styles });
});

reflectionRouter.post("/rewrite", async (req, res) => {
  try {
    const request = validateReflectionRequest(req.body, styleCards);
    const result = await generateReflectionResponse(request);

    res.json(result);
  } catch (error) {
    console.error(error);

    if (error?.statusCode) {
      return res.status(error.statusCode).json({
        error: error.message,
        details: error.details || undefined
      });
    }

    if (error?.code === "insufficient_quota" || error?.status === 429) {
      return res.status(429).json({
        error: "OpenAI API quota exceeded. Please check your OpenAI billing or project quota."
      });
    }

    if (error?.status === 401) {
      return res.status(401).json({
        error: "OpenAI API key was rejected. Please check server/.env."
      });
    }

    res.status(500).json({
      error: "Reflection response failed."
    });
  }
});