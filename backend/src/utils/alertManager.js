// src/utils/alertManager.js
import { io } from "../index.js"; // Usa la instancia Socket.IO del servidor
import { createLog } from "./logger.js"; // Para registrar la alerta en logs

/**
 * 📢 Envía una alerta de seguridad al administrador en tiempo real
 * y la guarda en los logs del sistema.
 * @param {Object} alert - { title, description }
 */
export const sendSecurityAlert = async ({ title, description }) => {
  try {
    // Registrar en logs
    await createLog({
      role: "system",
      action: "ALERTA DE SEGURIDAD",
      description,
    });

    // Emitir alerta en tiempo real a todos los administradores conectados
    io.emit("securityAlert", {
      title,
      description,
      timestamp: new Date(),
    });

    console.log("🚨 Alerta de seguridad enviada:", title);
  } catch (error) {
    console.error("❌ Error al enviar alerta de seguridad:", error);
  }
};
