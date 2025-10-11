// ==============================
// 🤖 ai.controller.js – ServiGo
// Clasificación de incidencias | Estimación de precio | Análisis de logs
// ==============================

import { getAIClient } from "../utils/ai/provider.js";
import { analyzeSystemLogs } from "../services/aiLog.service.js";

const ai = getAIClient();

// ==============================
// 🧩 Clasificación de incidencias
// ==============================
export const classifyIncident = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string" || text.trim().length < 6) {
      return res
        .status(400)
        .json({ message: "Texto de incidencia inválido o demasiado corto" });
    }

    const result = await ai.classifyIncident({ text: text.trim() });

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("❌ IA classifyIncident:", err.message);
    return res.status(500).json({
      success: false,
      message: "Error al clasificar incidencia",
    });
  }
};

// ==============================
// 💰 Estimación de precio
// ==============================
export const estimatePrice = async (req, res) => {
  try {
    const {
      category = "General",
      urgency = "normal",
      complexity = "media",
    } = req.body;

    const validUrgency = ["normal", "urgente", "programado"].includes(
      String(urgency).toLowerCase()
    );
    const validComplex = ["baja", "media", "alta"].includes(
      String(complexity).toLowerCase()
    );

    if (!validUrgency || !validComplex) {
      return res.status(400).json({
        message: "Parámetros de urgencia o complejidad inválidos",
      });
    }

    const result = await ai.estimatePrice({
      category,
      urgency: String(urgency).toLowerCase(),
      complexity: String(complexity).toLowerCase(),
    });

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("❌ IA estimatePrice:", err.message);
    return res.status(500).json({
      success: false,
      message: "Error al estimar precio",
    });
  }
};

// ==============================
// 🧠 Análisis Predictivo de Logs
// ==============================
export const analyzeLogs = async (req, res) => {
  try {
    const result = await analyzeSystemLogs(); // 🔍 Llama al servicio IA
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("❌ Error en analyzeLogs:", err.message);
    return res.status(500).json({
      success: false,
      message: "Error al analizar los logs del sistema",
    });
  }
};
