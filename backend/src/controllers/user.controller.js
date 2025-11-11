// ===============================
// 👤 Controlador de Usuarios – ServiGo
// ===============================

import User from "../models/User.js";

/* ===========================================
 🧩 Obtener todas las categorías (profesiones únicas)
=========================================== */
export const getSpecialties = async (req, res) => {
  try {
    // 🔍 Solo tomamos los usuarios con rol "profesional"
    const specialties = await User.distinct("specialty", { role: "profesional" });

    // 🧹 Limpiamos posibles duplicados/vacíos
    const filtered = specialties.filter(
      (s) => typeof s === "string" && s.trim() !== ""
    );

    res.status(200).json(filtered);
  } catch (error) {
    console.error("❌ Error al obtener categorías:", error);
    res.status(500).json({
      error: "Error al obtener las categorías de profesionales",
    });
  }
};

/* ===========================================
 🧾 (Opcional futuro)
 Obtener todos los usuarios o profesionales
=========================================== */
export const getAllProfessionals = async (req, res) => {
  try {
    const users = await User.find({ role: "profesional" }).select(
      "name email specialty averageRating"
    );
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al listar profesionales" });
  }
};
