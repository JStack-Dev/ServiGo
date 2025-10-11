// ==============================
// 🧾 logger.js – Sistema de Logging Profesional (Winston)
// ==============================
import winston from "winston";
import path from "path";
import fs from "fs";

// 📂 Crear carpeta de logs si no existe
const logDir = path.resolve("logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// 🎚️ Niveles de log personalizados
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// 🎨 Colores para consola
winston.addColors({
  error: "red bold",
  warn: "yellow bold",
  info: "green",
  http: "magenta",
  debug: "blue",
});

// 📋 Configuración base del logger
const logger = winston.createLogger({
  levels,
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      ({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`
    )
  ),
  transports: [
    // 🪵 Guardar logs en archivo
    new winston.transports.File({
      filename: path.join(logDir, "errors.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
  ],
});

// 💻 En modo desarrollo, mostramos también en consola
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple()
      ),
    })
  );
}

export default logger;
