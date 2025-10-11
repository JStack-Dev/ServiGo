// ==============================
// 🤖 ai.routes.js – ServiGo
// ==============================
import express from "express";
import rateLimit from "express-rate-limit";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { classifyIncident, estimatePrice } from "../controllers/ai.controller.js";

const router = express.Router();

// 🔒 Rate limit básico para IA (protege de abuso)
const aiLimiter = rateLimit({
  windowMs: 60_000,          // 1 min
  max: 30,                   // 30 req/min por IP
  standardHeaders: true,
  legacyHeaders: false,
});

// Rutas IA (protegidas con JWT)
router.post("/incidents/classify", verifyToken, aiLimiter, classifyIncident);
router.post("/pricing/estimate", verifyToken, aiLimiter, estimatePrice);

export default router;
