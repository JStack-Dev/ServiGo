import express from "express";
import { getDashboardStats, getRecentActivity } from "../controllers/dashboard.controller.js";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/stats", verifyToken, checkRole("admin"), getDashboardStats);
router.get("/recent", verifyToken, checkRole("admin"), getRecentActivity);

export default router;
