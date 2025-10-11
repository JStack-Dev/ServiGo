import express from "express";
import {
  exportUsersCSV,
  exportServicesPDF,
  exportPaymentsCSV,
} from "../controllers/report.controller.js";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/users/csv", verifyToken, checkRole("admin"), exportUsersCSV);
router.get("/services/pdf", verifyToken, checkRole("admin"), exportServicesPDF);
router.get("/payments/csv", verifyToken, checkRole("admin"), exportPaymentsCSV);

export default router;
