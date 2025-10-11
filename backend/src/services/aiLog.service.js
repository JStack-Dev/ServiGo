// ==============================
// 🤖 aiLog.service.js – ServiGo
// Análisis Inteligente de Logs del Sistema
// ==============================
import fs from "fs";
import path from "path";
import { getAIClient } from "../utils/ai/provider.js";

const ai = getAIClient();

// 📂 Rutas absolutas de los archivos de log
const LOGS_DIR = path.resolve("logs");
const ERROR_LOG_PATH = path.join(LOGS_DIR, "errors.log");
const COMBINED_LOG_PATH = path.join(LOGS_DIR, "combined.log");

// 🧠 Analiza los logs y devuelve un diagnóstico IA
export const analyzeSystemLogs = async () => {
  try {
    // 1️⃣ Lectura segura de los logs
    const errors = fs.existsSync(ERROR_LOG_PATH)
      ? fs.readFileSync(ERROR_LOG_PATH, "utf-8").split("\n").slice(-50).join("\n")
      : "Sin registros de error recientes.";

    const combined = fs.existsSync(COMBINED_LOG_PATH)
      ? fs.readFileSync(COMBINED_LOG_PATH, "utf-8").split("\n").slice(-50).join("\n")
      : "Sin registros generales recientes.";

    // 2️⃣ Generamos el contexto para la IA
    const prompt = `
Analiza los siguientes logs del sistema ServiGo y devuelve un diagnóstico JSON.
Campos esperados:
{
  "health": "estable" | "inestable" | "crítico",
  "mainIssues": "Descripción breve de problemas detectados",
  "recommendations": ["Lista de acciones recomendadas"],
  "confidence": 0.0–1.0
}

🟢 LOGS GENERALES:
${combined}

🔴 LOGS DE ERROR:
${errors}
`;

    // 3️⃣ Solicitamos el análisis al modelo IA
    const response = await ai.client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Eres un analista de sistemas que identifica problemas y genera diagnósticos técnicos a partir de logs.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    // 4️⃣ Procesamos la respuesta
    const raw = response.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw);

    return {
      health: parsed.health || "estable",
      mainIssues:
        parsed.mainIssues || "No se detectaron incidencias relevantes.",
      recommendations:
        parsed.recommendations || ["Monitorear logs durante las próximas horas."],
      confidence: parsed.confidence || 0.9,
    };
  } catch (err) {
    console.error("❌ Error en analyzeSystemLogs:", err.message);
    return {
      health: "desconocido",
      mainIssues: err.message,
      recommendations: ["Error al procesar logs"],
      confidence: 0.3,
    };
  }
};
