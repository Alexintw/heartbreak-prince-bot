import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { reflectionRouter } from "./api/reflectionRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "heartbreak-prince-bot",
    architecture: [
      "frontend",
      "backend_api",
      "product_logic",
      "data_layer",
      "openai_api"
    ]
  });
});

app.use("/api", reflectionRouter);

app.listen(PORT, () => {
  console.log(`Heartbreak prince bot server running on port ${PORT}`);
});