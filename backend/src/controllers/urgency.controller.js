import User from "../models/User.js";
import Service from "../models/Service.js";

// 🚨 Crear servicio urgente y asignar profesional cercano
export const createUrgentService = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    // 1️⃣ Buscar profesional más cercano y disponible
    const nearestPro = await User.findOne({
      role: "profesional",
      isAvailable: true,
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: location },
          $maxDistance: 5000, // radio 5km
        },
      },
    });

    if (!nearestPro) {
      return res.status(404).json({ error: "No hay profesionales disponibles cerca" });
    }

    // 2️⃣ Crear servicio urgente asignado a ese profesional
    const urgentService = await Service.create({
      title,
      description,
      category,
      urgency: true,
      status: "en_proceso",
      client: req.user.id,
      professional: nearestPro._id,
      assignedTo: nearestPro._id,
      acceptedAt: new Date(),
    });

    // 3️⃣ Marcar profesional como ocupado
    nearestPro.isAvailable = false;
    await nearestPro.save();

    res.status(201).json({
      message: "🚨 Servicio urgente asignado automáticamente",
      assignedProfessional: nearestPro.name,
      service: urgentService,
    });
  } catch (error) {
    console.error("❌ Error en urgencia:", error);
    res.status(500).json({ error: "Error al crear servicio urgente" });
  }
};
