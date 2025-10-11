import Review from "../models/Review.js";
import Service from "../models/Service.js";
import User from "../models/User.js";

// 🟢 Crear reseña
export const createReview = async (req, res) => {
  try {
    const { serviceId, rating, comment } = req.body;

    // Verificar que el servicio existe y pertenece al cliente
    const service = await Service.findById(serviceId);
    if (!service || service.client.toString() !== req.user.id) {
      return res.status(403).json({ error: "No puedes valorar este servicio" });
    }

    // Crear reseña
    const review = await Review.create({
      service: service._id,
      client: req.user.id,
      professional: service.professional,
      rating,
      comment,
    });

    // Actualizar puntuación promedio del profesional
    const reviews = await Review.find({ professional: service.professional });
    const avgRating =
      reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    await User.findByIdAndUpdate(service.professional, { averageRating: avgRating });

    res.status(201).json({
      message: "✅ Reseña creada correctamente",
      review,
      newAverage: avgRating.toFixed(2),
    });
  } catch (error) {
    console.error("❌ Error al crear reseña:", error);
    res.status(500).json({ error: "Error al crear reseña" });
  }
};

// 🔹 Obtener reseñas de un profesional
export const getProfessionalReviews = async (req, res) => {
  try {
    const { id } = req.params; // id del profesional
    const reviews = await Review.find({ professional: id })
      .populate("client", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener reseñas" });
  }
};
