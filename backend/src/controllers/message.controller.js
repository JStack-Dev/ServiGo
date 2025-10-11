// ==============================
// 💬 message.controller.js
// Sistema de Chat en Tiempo Real – ServiGo
// ==============================

import mongoose from "mongoose";
import Message from "../models/Message.js";
import { io } from "../index.js";

/**
 * 📤 Enviar mensaje entre cliente y profesional
 * Requisitos: serviceId válido (ObjectId), receiver (ObjectId), content (string)
 * Asume que req.user viene del middleware verifyToken
 */
export const sendMessage = async (req, res) => {
  try {
    const { serviceId, receiver, content } = req.body;
    const sender = req.user?.id || null;

    // Validaciones básicas
    if (!serviceId || !receiver || typeof content !== "string") {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    // Validaciones de ObjectId
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ message: "serviceId inválido" });
    }
    if (!mongoose.Types.ObjectId.isValid(receiver)) {
      return res.status(400).json({ message: "receiver inválido" });
    }
    if (!sender || !mongoose.Types.ObjectId.isValid(sender)) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    // Normalización de contenido
    const normalizedContent = content.trim();
    if (!normalizedContent) {
      return res.status(400).json({ message: "El contenido del mensaje no puede estar vacío" });
    }

    // Crear y guardar el mensaje en MongoDB
    const message = await Message.create({
      serviceId,
      sender,
      receiver,
      content: normalizedContent,
    });

    // Emitir el mensaje en tiempo real al canal del servicio
    io.to(`room_service_${serviceId}`).emit("newMessage", {
      ...message._doc,
      sender: { id: sender }, // evita exponer todo req.user
    });

    console.log(`💬 Mensaje enviado en room_service_${serviceId}`);

    return res.status(201).json({
      success: true,
      message: "Mensaje enviado correctamente",
      data: message,
    });
  } catch (error) {
    console.error("❌ Error al enviar mensaje:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error al enviar mensaje",
      error: error.message,
    });
  }
};

/**
 * 📥 Obtener historial de mensajes de un servicio
 * Valida que serviceId sea ObjectId y devuelve lista ordenada por fecha ascendente
 */
export const getMessagesByService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    if (!serviceId) {
      return res.status(400).json({ message: "ID del servicio requerido" });
    }
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ message: "serviceId inválido" });
    }

    const messages = await Message.find({ serviceId })
      .populate("sender", "name role")
      .populate("receiver", "name role")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      total: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error("❌ Error al cargar mensajes:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error al cargar mensajes",
      error: error.message,
    });
  }
};
