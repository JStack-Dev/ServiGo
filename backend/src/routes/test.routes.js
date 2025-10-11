import express from "express";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 🔓 Ruta protegida para usuarios logueados (cualquier rol)
router.get("/perfil", verifyToken, (req, res) => {
  res.json({
    message: `Bienvenido ${req.user.id}, tu rol es ${req.user.role} ✅`,
  });
});

// 🔒 Solo admin puede acceder
router.get("/admin", verifyToken, checkRole("admin"), (req, res) => {
  res.json({
    message: "Acceso concedido al panel de administrador 🛠️",
  });
});

// 🔒 Solo profesional o admin
router.get("/profesional", verifyToken, checkRole("profesional", "admin"), (req, res) => {
  res.json({
    message: "Acceso permitido al área profesional 👷‍♂️",
  });
});

export default router;
