import express from "express";
import { createCheckoutSession, handleWebhook } from "../controllers/payment.controller.js";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Crear sesión de pago (cliente)
router.post("/checkout", verifyToken, checkRole("cliente"), createCheckoutSession);

// Webhook Stripe (sin verificación de token)
router.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);

export default router;
