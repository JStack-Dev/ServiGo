// 📁 src/routes/log.routes.js
import express from "express";
import { getAllLogs, clearLogs } from "../controllers/log.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 🧾 Obtener todos los logs (solo admin)
router.get("/", verifyToken, isAdmin, getAllLogs);

// 🧹 Limpiar todos los logs (solo admin)
router.delete("/", verifyToken, isAdmin, clearLogs);

export default router;
