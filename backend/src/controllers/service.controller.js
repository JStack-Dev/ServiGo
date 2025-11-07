// ==============================
// 💼 Service Controller – ServiGo (Versión Final)
// ==============================

import Service from "../models/Service.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { io } from "../index.js";
import { createLog } from "../utils/logger.js";

// 🔵 Obtener servicios del cliente autenticado
export const getServicesByClient = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query; // ?status=pendiente|en_proceso|completado

    const filter = { client: userId };
    if (status) filter.status = status;

    const services = await Service.find(filter)
      .populate("professional", "name email phone profession averageRating")
      .sort({ createdAt: -1 });

    res.status(200).json(services);
  } catch (error) {
    console.error("❌ Error al obtener servicios del cliente:", error);
    res.status(500).json({ error: "Error al obtener los servicios del cliente" });
  }
};

// 👨‍🔧 Obtener servicios activos del profesional autenticado
export const getActiveServicesByProfessional = async (req, res) => {
  try {
    const professionalId = req.user.id;
    const { status } = req.query; // ?status=en_proceso|pendiente|completado

    const filter = { professional: professionalId };
    if (status) filter.status = status;

    const services = await Service.find(filter)
      .populate("client", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json(services);
  } catch (error) {
    console.error("❌ Error al obtener servicios del profesional:", error);
    res
      .status(500)
      .json({ error: "Error al obtener los servicios activos del profesional" });
  }
};

// 🟢 Crear un nuevo servicio (solo profesionales)
export const createService = async (req, res) => {
  try {
    const { title, description, category, price, urgency, scheduledDate } = req.body;

    if (!title || !description || !category) {
      return res
        .status(400)
        .json({ error: "Título, descripción y categoría son obligatorios" });
    }

    const newService = new Service({
      title,
      description,
      category,
      price,
      urgency,
      scheduledDate,
      professional: req.user.id,
    });

    await newService.save();

    // 🔔 Emitir evento Socket.IO
    io.emit(urgency ? "newUrgentService" : "newService", {
      message: urgency
        ? "🚨 Nuevo servicio urgente disponible"
        : "📋 Nuevo servicio publicado",
      service: newService,
    });

    // 📜 Registrar log
    await createLog({
      user: req.user.id,
      role: req.user.role,
      action: "CREAR_SERVICIO",
      description: `Servicio creado: ${newService.title}`,
      req,
    });

    // 🔔 Notificar a los administradores
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      const notification = await Notification.create({
        user: admin._id,
        title: "Nuevo servicio creado",
        message: `El profesional ${req.user.name} publicó: "${newService.title}"`,
        type: "service",
      });

      io.to(`room_user_${admin._id}`).emit("newNotification", {
        id: notification._id,
        title: notification.title,
        message: notification.message,
        read: notification.read,
        createdAt: notification.createdAt,
      });
    }

    res.status(201).json({
      message: "Servicio creado correctamente ✅",
      service: newService,
    });
  } catch (error) {
    console.error("❌ Error al crear servicio:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// ⭐ Valorar al profesional
export const rateProfessional = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ error: "La valoración debe ser entre 1 y 5" });

    const service = await Service.findById(id).populate("professional");
    if (!service)
      return res.status(404).json({ error: "Servicio no encontrado" });

    if (service.client.toString() !== req.user.id)
      return res.status(403).json({ error: "No puedes valorar este servicio" });

    if (service.status !== "completado")
      return res.status(400).json({ error: "Solo puedes valorar servicios completados" });

    // Actualizamos promedio del profesional
    const pro = service.professional;
    const totalValoraciones = pro.completedServices || 1;
    pro.averageRating =
      ((pro.averageRating || 0) * (totalValoraciones - 1) + rating) /
      totalValoraciones;
    await pro.save();

    res.json({ message: "Valoración enviada correctamente ✅" });
  } catch (error) {
    console.error("❌ Error al valorar profesional:", error);
    res.status(500).json({ error: "Error al enviar la valoración" });
  }
};

// 🚫 Cancelar servicio (cliente)
export const cancelService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service)
      return res.status(404).json({ error: "Servicio no encontrado" });

    if (service.client.toString() !== req.user.id)
      return res.status(403).json({ error: "No puedes cancelar este servicio" });

    if (service.status !== "pendiente")
      return res
        .status(400)
        .json({ error: "Solo puedes cancelar servicios pendientes" });

    service.status = "cancelado";
    await service.save();

    res.json({ message: "Servicio cancelado correctamente ❌", service });
  } catch (error) {
    console.error("❌ Error al cancelar servicio:", error);
    res.status(500).json({ error: "Error al cancelar el servicio" });
  }
};

// 🗑️ Eliminar servicio (solo admin o profesional creador)
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service)
      return res.status(404).json({ error: "Servicio no encontrado" });

    // Solo admin o profesional creador
    if (
      req.user.role !== "admin" &&
      service.professional.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ error: "No autorizado para eliminar este servicio" });
    }

    await Service.findByIdAndDelete(id);

    await createLog({
      user: req.user.id,
      role: req.user.role,
      action: "ELIMINAR_SERVICIO",
      description: `Servicio eliminado: ${service.title}`,
      req,
    });

    res.json({ message: "Servicio eliminado correctamente 🗑️" });
  } catch (error) {
    console.error("❌ Error al eliminar servicio:", error);
    res.status(500).json({ error: "Error al eliminar el servicio" });
  }
};
