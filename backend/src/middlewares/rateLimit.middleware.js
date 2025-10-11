// src/middlewares/rateLimit.middleware.js
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

// 🚦 Limitador de velocidad (máx 100 peticiones / 15 minutos por IP)
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo de peticiones por IP
  message: {
    success: false,
    message: "Demasiadas peticiones desde esta IP, inténtalo más tarde.",
  },
  standardHeaders: true, // Devuelve info de rate-limit en cabeceras
  legacyHeaders: false,
});

// 🐢 Acelerador progresivo (v2 compatible)
export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutos
  delayAfter: 50, // Empieza a ralentizar tras 50 peticiones
  delayMs: () => 500, // Siempre añade 500 ms por cada petición extra
});

