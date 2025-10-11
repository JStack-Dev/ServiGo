import User from "../models/User.js";

// 🧭 Actualizar ubicación y disponibilidad del profesional
export const updateLocation = async (req, res) => {
  try {
    const { lat, lng, isAvailable } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ error: "Latitud y longitud son obligatorias" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        location: { type: "Point", coordinates: [lng, lat] },
        isAvailable: isAvailable ?? true,
      },
      { new: true }
    );

    res.json({
      message: "📍 Ubicación actualizada correctamente",
      user: {
        name: updatedUser.name,
        isAvailable: updatedUser.isAvailable,
        coordinates: updatedUser.location.coordinates,
      },
    });
  } catch (error) {
    console.error("❌ Error al actualizar ubicación:", error);
    res.status(500).json({ error: "Error al actualizar ubicación" });
  }
};

// 🗺️ Obtener profesionales disponibles cercanos a un cliente
export const getNearbyProfessionals = async (req, res) => {
  try {
    const { lat, lng, maxDistance = 5000 } = req.query; // en metros

    const professionals = await User.find({
      role: "profesional",
      isAvailable: true,
      location: {
        $nearSphere: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseFloat(maxDistance),
        },
      },
    }).select("name email location isAvailable averageRating level");

    res.json(professionals);
  } catch (error) {
    console.error("❌ Error al buscar profesionales:", error);
    res.status(500).json({ error: "Error al buscar profesionales cercanos" });
  }
};
