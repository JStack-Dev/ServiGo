import express from "express";
import {
  getUserChats,
  getChatMessages,
  sendChatMessage,
  markMessagesAsRead,
} from "../controllers/chat.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 📩 Obtener lista de chats del usuario
router.get("/", verifyToken, getUserChats);

// 💬 Obtener mensajes por serviceId
router.get("/:serviceId", verifyToken, getChatMessages);

// 📨 Enviar mensaje
router.post("/:serviceId", verifyToken, sendChatMessage);

// 🟢 Marcar mensajes como leídos
router.patch("/read/:serviceId", verifyToken, markMessagesAsRead);

export default router;
