// ==============================
// 🔔 notification.controller.js
// Controlador de Notificaciones – ServiGo
// ==============================

import Notification from "../models/Notification.js";
import { io } from "../index.js";

// 📤 Crear y emitir una notificación
export const createNotification = async (userId, title, message, type = "service") => {
  try {
    const notification = await Notification.create({ user: userId, title, message, type });

    // Emitir al canal personal del usuario
    io.to(`room_user_${userId}`).emit("newNotification", notification);

    console.log(`🔔 Notificación enviada a room_user_${userId}`);
    return notification;
  } catch (error) {
    console.error("❌ Error al crear notificación:", error.message);
  }
};

// 📥 Obtener notificaciones del usuario logueado
export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener notificaciones", error: error.message });
  }
};

// ✅ Marcar una notificación como leída
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error al marcar como leída", error: error.message });
  }
};
