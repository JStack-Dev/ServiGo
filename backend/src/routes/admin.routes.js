import express from "express";
import {
  getAllUsers,
  deleteUser,
  getAllServicesAdmin,
  getAllPayments,
} from "../controllers/admin.controller.js";

import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 👥 Usuarios
router.get("/users", verifyToken, checkRole("admin"), getAllUsers);
router.delete("/users/:id", verifyToken, checkRole("admin"), deleteUser);

// 🧾 Servicios
router.get("/services", verifyToken, checkRole("admin"), getAllServicesAdmin);

// 💳 Pagos
router.get("/payments", verifyToken, checkRole("admin"), getAllPayments);

export default router;
