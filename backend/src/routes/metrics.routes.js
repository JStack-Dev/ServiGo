// ==============================
// 📈 metrics.routes.js – ServiGo
// ==============================
import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getMetrics } from "../services/metrics.service.js";

const router = express.Router();

// 📊 Ruta protegida: solo usuarios autenticados
router.get("/", verifyToken, (req, res) => {
  const metrics = getMetrics();
  res.status(200).json({ success: true, data: metrics });
});

export default router;
