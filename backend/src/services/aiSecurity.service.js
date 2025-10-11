// src/services/aiSecurity.service.js
import fs from "fs";
import path from "path";
import { analyzeWithAI } from "../utils/ai/provider.js"; // ya usado en módulo IA
import { createLog } from "../utils/logger.js";

/**
 * 🤖 Analiza los logs del sistema para detectar patrones de ataque o anomalías.
 * Devuelve un diagnóstico con nivel de riesgo y recomendaciones.
 */
export const analyzeSecurityPatterns = async () => {
  try {
    const logPath = path.resolve("logs/combined.log");

    if (!fs.existsSync(logPath)) {
      return { health: "sin_logs", message: "No se encontraron registros" };
    }

    const logs = fs.readFileSync(logPath, "utf-8");
    const lastEntries = logs.split("\n").slice(-200).join("\n"); // últimos 200 eventos

    const prompt = `
Analiza los siguientes registros del sistema y detecta comportamientos sospechosos:
${lastEntries}

Devuelve un JSON con:
{
  "health": "estable" | "inestable" | "crítico",
  "mainIssues": ["posibles ataques", "intentos de fuerza bruta", ...],
  "recommendations": ["bloquear IP", "verificar roles", ...],
  "confidence": 0-100
}
`;

    const analysis = await analyzeWithAI(prompt);

    // Registrar el diagnóstico en logs
    await createLog({
      role: "system",
      action: "ANÁLISIS DE SEGURIDAD IA",
      description: `Estado: ${analysis.health} | Confianza: ${analysis.confidence}%`,
    });

    return analysis;
  } catch (error) {
    console.error("❌ Error en análisis IA de seguridad:", error);
    return { health: "error", message: error.message };
  }
};
