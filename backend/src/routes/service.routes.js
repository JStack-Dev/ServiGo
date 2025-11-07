// ===============================================
// 💼 SERVICE ROUTES — ServiGo Backend
// ===============================================

import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  getServicesByClient,
  getActiveServicesByProfessional,
  createService,
  rateProfessional,
  cancelService,
  deleteService,
} from "../controllers/service.controller.js";
import Service from "../models/Service.js";

const router = express.Router();

/* =======================================================
   🔹 Obtener servicios del cliente autenticado
   ======================================================= */
router.get("/", verifyToken, getServicesByClient);

/* =======================================================
   👨‍🔧 Obtener servicios activos o completados del profesional
   (ruta antigua: /profesional/activos)
   ======================================================= */
router.get("/profesional/activos", verifyToken, getActiveServicesByProfessional);

/* =======================================================
   🟢 NUEVA RUTA: Obtener servicios activos del profesional
   (para JobsActive.tsx en el panel profesional)
   ======================================================= */
router.get("/active", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar servicios asignados al profesional actual
    const activeServices = await Service.find({
      professional: userId,
      status: { $in: ["active", "in_progress", "confirmed"] },
    })
      .populate("client", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(activeServices);
  } catch (error) {
    console.error("❌ Error al obtener servicios activos:", error);
    res.status(500).json({ error: "Error al obtener los servicios activos" });
  }
});

/* =======================================================
   🧰 Crear nuevo servicio
   ======================================================= */
router.post("/", verifyToken, createService);

/* =======================================================
   🚫 Cancelar servicio
   ======================================================= */
router.patch("/:id/cancel", verifyToken, cancelService);

/* =======================================================
   ⭐ Valorar al profesional
   ======================================================= */
router.patch("/:id/rate", verifyToken, rateProfessional);

/* =======================================================
   🗑️ Eliminar servicio (admin o profesional creador)
   ======================================================= */
router.delete("/:id", verifyToken, deleteService);

export default router;
