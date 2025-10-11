// src/middlewares/antifraud.middleware.js
import { createLog } from "../utils/logger.js"; // usamos el logger del sistema
import rateLimit from "express-rate-limit";
import { sendSecurityAlert } from "../utils/alertManager.js";


// 🧠 Historial en memoria para detectar intentos sospechosos
const failedAttempts = new Map();

/**
 * 🛡️ Middleware antifraude:
 * - Detecta múltiples intentos fallidos de login o abuso.
 * - Bloquea temporalmente IPs sospechosas.
 * - Registra la actividad en logs.
 */
export const antifraudMiddleware = (req, res, next) => {
  const ip = req.ip;

  // Solo aplicamos el control en rutas críticas (login, pagos, etc.)
  if (req.originalUrl.includes("/auth/login") || req.originalUrl.includes("/api/payments")) {
    const now = Date.now();
    const data = failedAttempts.get(ip) || { count: 0, lastAttempt: now, blockedUntil: null };

    // Si la IP está bloqueada
    if (data.blockedUntil && data.blockedUntil > now) {
      return res.status(429).json({
        success: false,
        message: "Demasiados intentos fallidos. Acceso bloqueado temporalmente.",
      });
    }

    // Si el intento es válido, seguimos
    req.on("finish", () => {
      if (res.statusCode === 401 || res.statusCode === 403) {
        // Fallo → incrementar contador
        data.count++;
        data.lastAttempt = now;

        // Si supera el límite → bloquear 10 minutos
        if (data.count >= 5) {
          data.blockedUntil = now + 10 * 60 * 1000;
          createLog({
            action: "Bloqueo antifraude",
            description: `IP ${ip} bloqueada por múltiples intentos fallidos`,
            role: "system",
          });
        }

        // Si supera el límite → bloquear 10 minutos
if (data.count >= 5) {
  data.blockedUntil = now + 10 * 60 * 1000;

  createLog({
    action: "Bloqueo antifraude",
    description: `IP ${ip} bloqueada por múltiples intentos fallidos`,
    role: "system",
  });

  // 🚨 Enviar alerta de seguridad en tiempo real al admin
  sendSecurityAlert({
    title: "🚨 Bloqueo antifraude activado",
    description: `La IP ${ip} ha sido bloqueada por intentos fallidos repetidos.`,
  });
}


        failedAttempts.set(ip, data);
      } else if (res.statusCode === 200) {
        // Éxito → limpiar historial
        failedAttempts.delete(ip);
      }
    });
  }

  next();
};
