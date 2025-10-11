// ==============================
// 🧾 logger.js
// Sistema centralizado de logging y auditoría
// ==============================

import Log from "../models/Log.js";

/**
 * 🧠 Registra un nuevo evento en la base de datos de logs.
 * Acepta tanto acciones de usuarios reales como eventos del sistema (IA, cron jobs, etc.)
 *
 * @param {Object} data - Datos del log
 * @param {String} [data.user] - ID del usuario (opcional para logs automáticos)
 * @param {String} [data.role] - Rol del usuario o "system" para eventos internos
 * @param {String} data.action - Acción realizada (ej: "LOGIN", "ANÁLISIS DE SEGURIDAD IA")
 * @param {String} data.description - Descripción del evento
 * @param {Object} [data.req] - Objeto de la request (para IP y User-Agent)
 */
export const createLog = async ({ user, role, action, description, req }) => {
  try {
    const logData = {
      user: user || null,
      role: role || "system", // ✅ Por defecto: logs automáticos del sistema
      action: action || "EVENTO",
      description: description || "Sin descripción",
      ip: req?.ip || "127.0.0.1",
      userAgent: req?.headers?.["user-agent"] || "Desconocido",
      createdAt: new Date(),
    };

    await Log.create(logData);
    console.log(`🧾 Log registrado: ${action} (${role})`);
  } catch (error) {
    console.error("❌ Error registrando log:", error.message);
  }
};

/**
 * 📜 Registra un evento rápido sin request
 * (ideal para procesos automáticos, IA, cron jobs, etc.)
 */
export const createSystemLog = async (action, description) => {
  try {
    await Log.create({
      user: null,
      role: "system",
      action,
      description,
      ip: "127.0.0.1",
      userAgent: "Sistema Interno",
      createdAt: new Date(),
    });
    console.log(`🧩 Log del sistema registrado: ${action}`);
  } catch (error) {
    console.error("❌ Error registrando log del sistema:", error.message);
  }
};
