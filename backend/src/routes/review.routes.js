import express from "express";
import { createReview, getProfessionalReviews } from "../controllers/review.controller.js";
import { verifyToken, checkRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @route POST /api/reviews
 * @desc Crear una reseña (cliente)
 */
router.post("/", verifyToken, checkRole("cliente"), createReview);

/**
 * @route GET /api/reviews/:id
 * @desc Obtener reseñas de un profesional
 */
router.get("/:id", getProfessionalReviews);

export default router;
