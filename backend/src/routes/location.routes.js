import express from "express";
import { updateLocation, getNearbyProfessionals } from "../controllers/location.controller.js";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Actualizar ubicación (profesional)
router.put("/", verifyToken, checkRole("profesional"), updateLocation);

// Buscar profesionales cercanos (cliente)
router.get("/nearby", verifyToken, checkRole("cliente"), getNearbyProfessionals);

export default router;
