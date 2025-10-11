import express from "express";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";
import { analyzeSecurityPatterns } from "../services/aiSecurity.service.js";

const router = express.Router();

/**
 * 🔐 Analiza los logs de seguridad con IA
 * Acceso exclusivo para administradores.
 */
router.get("/ai/security/analyze", verifyToken, checkRole(["admin"]), async (req, res) => {
  const result = await analyzeSecurityPatterns();
  res.status(200).json(result);
});

export default router;
