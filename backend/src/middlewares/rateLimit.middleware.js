// src/middlewares/rateLimit.middleware.js
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

const isDev = process.env.NODE_ENV !== "production"; // true cuando estás en local

/* ==============================================
   🛡️ Limitador de velocidad inteligente
   Solo se activa en producción
============================================== */
export const limiter = isDev
  ? (req, res, next) => next() // 🚀 sin límites en desarrollo
  : rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // Máx. peticiones por IP
      message: {
        success: false,
        message: "Demasiadas peticiones desde esta IP, inténtalo más tarde.",
      },
      standardHeaders: true,
      legacyHeaders: false,
    });

/* ==============================================
   🐢 Acelerador progresivo (solo producción)
============================================== */
export const speedLimiter = isDev
  ? (req, res, next) => next()
  : slowDown({
      windowMs: 15 * 60 * 1000, // 15 minutos
      delayAfter: 50, // Empieza a ralentizar tras 50 peticiones
      delayMs: () => 500, // Añade 500 ms por cada petición extra
    });
