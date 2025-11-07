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

import express from "express";
import { AdminController } from "./admin.controller.js";
import { verifyAdminRole } from "./admin.middleware.js";

const router = express.Router();

router.use(verifyAdminRole);

router.get("/users", AdminController.getUsers);
router.patch("/users/:id", AdminController.updateUser);

router.get("/services", AdminController.getServices);
router.delete("/services/:id", AdminController.deleteService);

router.get("/bookings", AdminController.getBookings);
router.get("/stats/overview", AdminController.getStats);

// 🔹 Nuevo endpoint
router.get("/logs", AdminController.getLogs);

export default router;
