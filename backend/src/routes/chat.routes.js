import express from "express";
import { getUserChats } from "../controllers/chat.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 🔹 Obtener lista de chats del usuario logueado
router.get("/", verifyToken, getUserChats);

export default router;
