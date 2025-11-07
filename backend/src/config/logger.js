import winston from "winston";
import path from "path";
import fs from "fs";

// 📂 Carpeta de logs
const logDir = path.resolve("logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

// 🧩 Variable global para el socket
let ioInstance = null;
export const attachLoggerSocket = (io) => {
  ioInstance = io;
};

// 🚀 Configuración Winston
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
  ],
});

// 🧠 Middleware que emite los logs por Socket.IO
const broadcastLog = (info) => {
  if (ioInstance) {
    ioInstance.emit("system:log", {
      level: info.level,
      message: info.message,
      timestamp: info.timestamp || new Date().toISOString(),
      meta: info.meta || {},
    });
  }
};

// Escuchamos los logs generados por Winston
logger.on("data", broadcastLog);

// 💻 Mostrar logs en consola en desarrollo
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default logger;
