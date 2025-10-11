import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * @route GET /api/users/profile
 * @desc Ver perfil completo con nivel y medallas
 * @access Profesional autenticado
 */
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({
      name: user.name,
      email: user.email,
      role: user.role,
      averageRating: user.averageRating,
      completedServices: user.completedServices,
      level: user.level,
      badges: user.badges,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el perfil" });
  }
});

export default router;
