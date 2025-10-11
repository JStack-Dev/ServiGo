import express from "express";
import {
  createService,
  getAllServices,
  getServicesByProfessional,
  updateService,
  deleteService,
  updateServiceStatus,
} from "../controllers/service.controller.js";

import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/services
 * @desc    Crear un nuevo servicio
 * @access  Solo profesionales
 */
router.post("/", verifyToken, checkRole("profesional", "admin"), createService);

/**
 * @route   GET /api/services
 * @desc    Obtener todos los servicios (para clientes o admin)
 * @access  Público autenticado
 */
router.get("/", verifyToken, checkRole("cliente", "admin"), getAllServices);

/**
 * @route   GET /api/services/mis-servicios
 * @desc    Obtener servicios del profesional logueado
 * @access  Profesional
 */
router.get("/mis-servicios", verifyToken, checkRole("profesional", "admin"), getServicesByProfessional);

/**
 * @route   PUT /api/services/:id
 * @desc    Actualizar un servicio
 * @access  Profesional o Admin
 */
router.put("/:id", verifyToken, checkRole("profesional", "admin"), updateService);

/**
 * @route   DELETE /api/services/:id
 * @desc    Eliminar un servicio
 * @access  Profesional o Admin
 */
router.delete("/:id", verifyToken, checkRole("profesional", "admin"), deleteService);

export default router;


/**
 * @route   PATCH /api/services/:id/status
 * @desc    Actualizar estado del servicio (aceptar, completar, cancelar)
 * @access  Profesional / Admin
 */
router.patch("/:id/status", verifyToken, checkRole("profesional", "admin"), updateServiceStatus);
