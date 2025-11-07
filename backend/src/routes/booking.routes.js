// ==============================
// 📅 Rutas de reservas (Bookings)
// IA + Imagen + Notificaciones + Tiempo real
// ==============================

import { Router } from "express";
import Booking from "../models/Booking.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getIO } from "../config/socket.js";
import { createBookingWithAI } from "../controllers/booking.ai.controller.js";
import { uploadIncidentImage } from "../middlewares/upload.middleware.js";
import logger from "../config/logger.js";

const router = Router();

/* ============================================================
   📋 Obtener reservas del usuario autenticado
============================================================ */
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    const filter =
      role === "profesional"
        ? { professionalId: userId }
        : { clientId: userId };

    const bookings = await Booking.find(filter)
      .populate("clientId", "name email")
      .populate("professionalId", "name email")
      .populate("serviceId", "title category")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    logger.error(`❌ Error al obtener reservas: ${error.message}`);
    res.status(500).json({ message: "Error al obtener reservas" });
  }
});

/* ============================================================
   🆕 Crear reserva manual (cliente selecciona servicio)
============================================================ */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { serviceId, professionalId, date, amount } = req.body;

    const booking = await Booking.create({
      serviceId,
      clientId: req.user.id,
      professionalId,
      date,
      amount,
    });

    const io = getIO();

    // 🔔 Notificación en tiempo real al profesional
    io.to(`room_user_${professionalId}`).emit("newNotification", {
      title: "Nueva reserva",
      message: `Tienes una nueva reserva del cliente ${req.user.name}.`,
      read: false,
      createdAt: new Date().toISOString(),
    });

    // ⚡ Evento Socket.IO general
    io.emit("booking:created", { professionalId, bookingId: booking._id });

    res.json(booking);
  } catch (error) {
    logger.error(`❌ Error al crear reserva: ${error.message}`);
    res.status(500).json({ message: "Error al crear reserva" });
  }
});

/* ============================================================
   ✅ Completar reserva (profesional)
============================================================ */
router.patch("/:id/complete", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true }
    );

    if (booking) {
      const io = getIO();

      io.to(`room_user_${booking.clientId}`).emit("newNotification", {
        title: "Reserva completada ✅",
        message: "Tu reserva ha sido marcada como completada por el profesional.",
        read: false,
        createdAt: new Date().toISOString(),
      });

      io.emit("booking:updated", {
        clientId: booking.clientId,
        status: "completed",
      });
    }

    res.json(booking);
  } catch (error) {
    logger.error(`❌ Error al completar reserva: ${error.message}`);
    res.status(500).json({ message: "Error al completar reserva" });
  }
});

/* ============================================================
   ❌ Cancelar reserva
============================================================ */
router.patch("/:id/cancel", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );

    if (booking) {
      const io = getIO();

      io.to(`room_user_${booking.clientId}`).emit("newNotification", {
        title: "Reserva cancelada ❌",
        message: "Tu reserva ha sido cancelada.",
        read: false,
        createdAt: new Date().toISOString(),
      });

      io.emit("booking:updated", {
        clientId: booking.clientId,
        status: "cancelled",
      });
    }

    res.json(booking);
  } catch (error) {
    logger.error(`❌ Error al cancelar reserva: ${error.message}`);
    res.status(500).json({ message: "Error al cancelar reserva" });
  }
});

/* ============================================================
   🤖 Crear reserva automáticamente con IA + imagen
   (Formulario "Reportar incidencia")
============================================================ */
router.post(
  "/ai",
  verifyToken,
  uploadIncidentImage.single("image"),
  async (req, res) => {
    try {
      const { description, date, address, notes } = req.body;
      const clientId = req.user.id;

      if (!description || !address) {
        return res.status(400).json({
          success: false,
          message: "Descripción y dirección son obligatorias.",
        });
      }

      // 🧠 (opcional) análisis IA local o delegado a controller
      const detectedCategory = "fontanero"; // Simulación temporal

      const imageUrl = req.file
        ? `/uploads/incidencias/${req.file.filename}`
        : null;

      const newBooking = await Booking.create({
        clientId,
        description,
        address,
        date: date || new Date(),
        notes,
        status: "pending",
        imageUrl,
        category: detectedCategory,
      });

      // 🔔 Notificación IA (ejemplo)
      const io = getIO();
      io.emit("booking:created", {
        professionalId: null,
        bookingId: newBooking._id,
      });

      logger.info(`🧾 Incidencia IA registrada: ${newBooking._id}`);

      res.status(201).json({
        success: true,
        message: "Incidencia registrada correctamente.",
        categoryDetected: detectedCategory,
        booking: newBooking,
      });
    } catch (error) {
      logger.error(`❌ Error al registrar incidencia: ${error.message}`);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor.",
      });
    }
  }
);

export default router;
