// =======================================
// 💬 Chat Direct Routes — ServiGo
// =======================================

import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  createOrGetDirectChat,
  getDirectMessages,
  getUserDirectChats, // ✅ nuevo controlador para listar todos los chats del usuario
} from "../controllers/chatDirect.controller.js";

const router = express.Router();

/* =======================================
   📬 Obtener todos los chats del usuario autenticado
   GET /api/direct-chats
======================================= */
router.get("/", verifyToken, getUserDirectChats);

/* =======================================
   🟢 Crear o recuperar chat directo
   POST /api/direct-chats
======================================= */
router.post("/", verifyToken, createOrGetDirectChat);

/* =======================================
   💬 Obtener mensajes de un chat específico
   GET /api/direct-chats/:chatId
======================================= */
router.get("/:chatId", verifyToken, getDirectMessages);

export default router;
