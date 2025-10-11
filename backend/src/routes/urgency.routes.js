import express from "express";
import { createUrgentService } from "../controllers/urgency.controller.js";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @route POST /api/urgencias
 * @desc Crear un servicio urgente y asignar profesional disponible
 * @access Cliente
 */
router.post("/", verifyToken, checkRole("cliente"), createUrgentService);

export default router;
