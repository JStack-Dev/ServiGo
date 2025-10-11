import Service from "../models/Service.js";
import User from "../models/User.js";
import { io } from "../index.js"; // ⚡ Socket.IO
import { createLog } from "../utils/logger.js"; // 🔍 Logs

// 🟢 Crear un nuevo servicio (solo profesionales)
export const createService = async (req, res) => {
  try {
    const { title, description, category, price, urgency, scheduledDate } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ error: "Título, descripción y categoría son obligatorios" });
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

    // 📢 Notificar a los usuarios conectados
    io.emit(urgency ? "newUrgentService" : "newService", {
      message: urgency
        ? "🚨 Nuevo servicio urgente disponible"
        : "📋 Nuevo servicio publicado",
      service: newService,
    });

    // 🧾 Log de creación de servicio
    await createLog({
      user: req.user.id,
      role: req.user.role,
      action: "CREAR_SERVICIO",
      description: `Servicio creado: ${newService.title}`,
      req,
    });

    res.status(201).json({ message: "Servicio creado correctamente ✅", service: newService });
  } catch (error) {
    console.error("❌ Error al crear servicio:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// 🟡 Obtener todos los servicios (clientes o admin)
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate("professional", "name email role");
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los servicios" });
  }
};

// 🟣 Obtener servicios por profesional
export const getServicesByProfessional = async (req, res) => {
  try {
    const services = await Service.find({ professional: req.user.id });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener servicios del profesional" });
  }
};

// 🔵 Actualizar un servicio
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) return res.status(404).json({ error: "Servicio no encontrado" });

    if (service.professional.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "No tienes permiso para editar este servicio" });
    }

    const updated = await Service.findByIdAndUpdate(id, req.body, { new: true });

    // 📢 Notificar actualización
    io.emit("serviceUpdated", {
      message: `🛠️ El servicio "${updated.title}" fue actualizado`,
      service: updated,
    });

    // 🧾 Log de actualización
    await createLog({
      user: req.user.id,
      role: req.user.role,
      action: "ACTUALIZAR_SERVICIO",
      description: `Servicio actualizado: ${updated.title}`,
      req,
    });

    res.json({ message: "Servicio actualizado correctamente", service: updated });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el servicio" });
  }
};

// 🔴 Eliminar un servicio
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) return res.status(404).json({ error: "Servicio no encontrado" });

    if (service.professional.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "No tienes permiso para eliminar este servicio" });
    }

    await service.deleteOne();

    // 📢 Notificar eliminación
    io.emit("serviceDeleted", {
      message: `🗑️ El servicio "${service.title}" ha sido eliminado`,
      serviceId: service._id,
    });

    // 🧾 Log de eliminación
    await createLog({
      user: req.user.id,
      role: req.user.role,
      action: "ELIMINAR_SERVICIO",
      description: `Servicio eliminado: ${service.title}`,
      req,
    });

    res.json({ message: "Servicio eliminado correctamente 🗑️" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el servicio" });
  }
};

// 🟢 Cambiar el estado de un servicio (aceptar, completar, cancelar)
export const updateServiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus } = req.body;

    const validStatuses = ["pendiente", "en_proceso", "completado", "cancelado"];
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({ error: "Estado no válido" });
    }

    const service = await Service.findById(id);
    if (!service) return res.status(404).json({ error: "Servicio no encontrado" });

    // Validaciones de permisos
    if (req.user.role === "profesional") {
      if (service.professional.toString() !== req.user.id && !service.assignedTo) {
        if (newStatus === "en_proceso") {
          service.assignedTo = req.user.id;
          service.acceptedAt = new Date();
        } else {
          return res.status(403).json({ error: "No puedes modificar este servicio aún" });
        }
      } else if (service.assignedTo?.toString() !== req.user.id) {
        return res.status(403).json({ error: "Este servicio pertenece a otro profesional" });
      }
    }

    // Actualizar estado
    service.status = newStatus;
    await service.save();

    // 📢 Notificación en tiempo real
    io.emit("statusUpdated", {
      message: `📦 El servicio "${service.title}" cambió a ${newStatus}`,
      serviceId: service._id,
      newStatus,
    });

    // 🎯 Si se completó, actualizar progreso (gamificación)
    if (newStatus === "completado") {
      const pro = await User.findById(service.professional);
      pro.completedServices = (pro.completedServices || 0) + 1;

      if (pro.averageRating >= 4.8 && pro.completedServices > 50) pro.level = "Diamante";
      else if (pro.averageRating >= 4.5 && pro.completedServices > 20) pro.level = "Oro";
      else if (pro.averageRating >= 4.0 && pro.completedServices > 10) pro.level = "Plata";
      else pro.level = "Bronce";

      if (pro.averageRating >= 4.8 && !pro.badges.includes("Top Valorado")) {
        pro.badges.push("Top Valorado");
      }
      if (pro.completedServices >= 20 && !pro.badges.includes("Constante")) {
        pro.badges.push("Constante");
      }

      await pro.save();

      await createLog({
        user: req.user.id,
        role: req.user.role,
        action: "COMPLETAR_SERVICIO",
        description: `Servicio completado: ${service.title}`,
        req,
      });
    }

    res.json({
      message: `Estado actualizado correctamente a "${newStatus}" ✅`,
      service,
    });
  } catch (error) {
    console.error("❌ Error al actualizar estado:", error);
    res.status(500).json({ error: "Error al actualizar el estado del servicio" });
  }
};
