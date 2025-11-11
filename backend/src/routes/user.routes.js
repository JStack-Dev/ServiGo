// ===============================
// 👤 Rutas de Usuario – ServiGo
// ===============================
import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import User from "../models/User.js";
import {
  getSpecialties,
  getAllProfessionals,
} from "../controllers/user.controller.js";

const router = express.Router();

/**
 * @route GET /api/users
 * @desc Listar usuarios (profesionales por categoría o todos)
 * @access Público
 */
router.get("/", async (req, res) => {
  try {
    const { role, specialty } = req.query;
    const filter = {};

    // ✅ Si no se especifica, asumimos que buscamos profesionales
    filter.role = role || "profesional";

    // ✅ Filtrar por categoría exacta (case-insensitive)
    if (specialty) {
      filter.specialty = new RegExp(`^${specialty}$`, "i");
    }

    const users = await User.find(filter).select(
      "name email role specialty phone averageRating isAvailable"
    );

    if (!users.length) {
      return res.status(404).json({
        message: `No se encontraron profesionales en la categoría "${specialty || "todas"}"`,
      });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error al listar usuarios:", error);
    res.status(500).json({ message: "Error al listar usuarios" });
  }
});

/**
 * @route GET /api/users/profile
 * @desc Ver perfil completo del usuario autenticado
 * @access Autenticado
 */
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      role: user.role,
      specialty: user.specialty,
      averageRating: user.averageRating,
      completedServices: user.completedServices,
      level: user.level,
      badges: user.badges,
    });
  } catch (error) {
    console.error("❌ Error al obtener el perfil:", error.message);
    res.status(500).json({ error: "Error al obtener el perfil" });
  }
});

/**
 * @route GET /api/users/categories
 * @desc Listar categorías (profesiones únicas sin duplicados)
 * @access Público
 */
router.get("/categories", getSpecialties);

/**
 * @route GET /api/users/professionals
 * @desc Listar todos los profesionales con info básica
 * @access Público
 */
router.get("/professionals", getAllProfessionals);

export default router;
