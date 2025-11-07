// routes/chat.routes.js
import express from "express";
import {
  getUserChats,
  getChatMessages,
  sendChatMessage,
  markMessageAsRead, // tu controlador ya correcto
} from "../controllers/chat.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 📩 Lista de chats
router.get("/", verifyToken, getUserChats);

// 💬 Mensajes por serviceId
router.get("/:serviceId", verifyToken, getChatMessages);

// 📨 Enviar mensaje
router.post("/:serviceId", verifyToken, sendChatMessage);

// 🟢 Marcar como leídos (ORDEN CAMBIADO)
router.patch("/read/:serviceId", verifyToken, markMessageAsRead);

export default router;
