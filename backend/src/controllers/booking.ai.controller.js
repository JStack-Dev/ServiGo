// =======================================
// 🤖 booking.ai.controller.js
// Compatible con OpenAI o LocalAI (según .env)
// =======================================

import Booking from "../models/Booking.js";
import dotenv from "dotenv";
import logger from "../config/logger.js";
import path from "path";
import axios from "axios";

dotenv.config();

/**
 * 🤖 Crear reserva automáticamente con IA
 * Analiza el texto del usuario y detecta la categoría correcta
 */
export const createBookingWithAI = async (req, res) => {
  try {
    const { description, date, address, notes } = req.body;
    const clientId = req.user.id;
    const imageFile = req.file;

    if (!description || !address) {
      return res.status(400).json({
        success: false,
        message: "Descripción y dirección son obligatorias.",
      });
    }

    /* ============================================================
       ⚙️ Configuración del proveedor IA (OpenAI o LocalAI)
    ============================================================ */
    const provider = process.env.AI_PROVIDER || "openai";
    const model = process.env.OPENAI_MODEL || "gpt-3.5-turbo";
    const localAIUrl = process.env.LOCAL_AI_URL;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    let detectedCategory = "general";

    /* ============================================================
       🧠 IA: Detección automática de categoría
    ============================================================ */
    try {
      const prompt = `
Eres un asistente experto en clasificar incidencias domésticas.
Analiza el siguiente texto y devuelve SOLO una palabra con la categoría más adecuada:
Opciones: fontanero, electricista, pintor, carpintero, cerrajero, limpieza, climatización, electrodomésticos, jardinero, general.

Descripción: """${description}"""
`;

      let responseText = "";

      if (provider === "localai" && localAIUrl) {
        // 🚀 Modo LocalAI (por ejemplo en http://localhost:8081)
        const { data } = await axios.post(
          localAIUrl,
          {
            model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.2,
            max_tokens: 50,
          },
          { headers: { "Content-Type": "application/json" } }
        );

        responseText =
          data?.choices?.[0]?.message?.content?.trim()?.toLowerCase() || "";
      } else if (openaiApiKey) {
        // 🌐 Modo OpenAI API
        const { default: OpenAI } = await import("openai");
        const openai = new OpenAI({ apiKey: openaiApiKey });

        const completion = await openai.chat.completions.create({
          model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
        });

        responseText =
          completion.choices[0]?.message?.content?.trim()?.toLowerCase() || "";
      }

      // ✅ Validar categoría reconocida
      const validCategories = [
        "fontanero",
        "electricista",
        "pintor",
        "carpintero",
        "cerrajero",
        "limpieza",
        "climatización",
        "electrodomésticos",
        "jardinero",
        "general",
      ];

      detectedCategory = validCategories.includes(responseText)
        ? responseText
        : "general";

      logger.info(`🤖 Categoría detectada por IA (${provider}): ${detectedCategory}`);
    } catch (aiError) {
      logger.warn(`⚠️ Error IA (${provider}): ${aiError.message}`);
    }

    /* ============================================================
       📸 Imagen adjunta
    ============================================================ */
    const imageUrl = imageFile
      ? `/uploads/incidencias/${path.basename(imageFile.path)}`
      : null;

    /* ============================================================
       💾 Guardar incidencia en base de datos
    ============================================================ */
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

    logger.info(`🧾 Nueva incidencia IA creada (${detectedCategory}): ${newBooking._id}`);

    return res.status(201).json({
      success: true,
      message: "Incidencia registrada correctamente.",
      categoryDetected: detectedCategory,
      booking: newBooking,
    });
  } catch (error) {
    logger.error(`❌ Error al crear incidencia con IA: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor al procesar la incidencia.",
    });
  }
};
