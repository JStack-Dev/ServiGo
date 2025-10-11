// ==============================
// 🧠 aiLog.routes.js – IA de Análisis de Logs
// ==============================
import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { analyzeSystemLogs } from "../services/aiLog.service.js";

const router = express.Router();

/**
 * @route   GET /api/ai/logs/analyze
 * @desc    Analiza los logs del sistema con IA
 * @access  Protegido (usuarios autenticados)
 */
router.get("/analyze", verifyToken, async (req, res) => {
  try {
    const analysis = await analyzeSystemLogs();
    res.status(200).json({
      success: true,
      message: "✅ Análisis de logs completado correctamente",
      data: analysis,
    });
  } catch (error) {
    console.error("❌ Error en /ai/logs/analyze:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al analizar los logs del sistema",
      error: error.message,
    });
  }
});

export default router;
