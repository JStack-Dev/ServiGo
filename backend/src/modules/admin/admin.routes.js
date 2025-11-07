// src/modules/admin/admin.routes.js
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

export default router;
