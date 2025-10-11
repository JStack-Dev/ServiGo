// ==============================
// 🌍 ServiGo Backend (v1.0)
// ==============================

// 📦 Importamos librerías principales
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import helmet from "helmet";
import { createServer } from "http";
import { Server } from "socket.io";

// 🧾 Logger profesional (Winston)
import logger from "./utils/winstonLogger.js";

// ⚙️ Configuración de variables de entorno
dotenv.config();

// 🚀 Inicializamos Express
const app = express();

// ==============================
// 🛡️ Seguridad avanzada (Punto 31)
// ==============================

// ✅ Lista blanca de dominios permitidos
const allowedOrigins = [
  "http://localhost:5173",      // frontend local (React/Vite)
  "https://servigo.app",        // dominio de producción
  "https://www.servigo.app",    // con www
];

// 🌐 Configuración segura de CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests internas (Postman, servidor, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ Origen no permitido por CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true, // permitir cookies o auth headers
};

// 🧱 Configuración avanzada de Helmet
const helmetConfig = helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:", "wss:"], // permite API + WebSockets
      fontSrc: ["'self'", "https:", "data:"],
      frameSrc: ["'none'"],
    },
  },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  frameguard: { action: "deny" },
});

// 🧩 Aplicamos seguridad global
app.use(helmetConfig);
app.use(cors(corsOptions));
app.use(limiter);
app.use(speedLimiter);

// ==============================
// 📊 Métricas en tiempo real
// ==============================
import {
  recordRequest,
  updateActiveSockets,
} from "./services/metrics.service.js";

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const responseTime = Date.now() - start;
    recordRequest(res.statusCode, responseTime);
  });
  next();
});

// ==============================
// 🛠️ Middlewares globales
// ==============================
app.use(express.json());
app.use(morgan("dev"));

// ==============================
// 🧩 Importamos rutas
// ==============================
import authRoutes from "./routes/auth.routes.js";
import testRoutes from "./routes/test.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import urgencyRoutes from "./routes/urgency.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import userRoutes from "./routes/user.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import locationRoutes from "./routes/location.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import reportRoutes from "./routes/report.routes.js";
import logRoutes from "./routes/log.routes.js";
import messageRoutes from "./routes/message.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import aiRoutes from "./routes/ai.routes.js"; // 🤖 IA principal
import aiLogRoutes from "./routes/aiLog.routes.js"; // 🤖 IA análisis de logs
import metricsRoutes from "./routes/metrics.routes.js"; // 📈 Métricas internas
import { limiter, speedLimiter } from "./middlewares/rateLimit.middleware.js";
// ==============================
// 🔗 Asignación de rutas base
// ==============================
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/urgencias", urgencyRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/ai/logs", aiLogRoutes);
app.use("/api/metrics", metricsRoutes); // 📊 Nueva ruta de métricas

// 🌍 Endpoint de prueba rápido
app.get("/api", (req, res) => {
  res.json({ mensaje: "Servidor ServiGo funcionando correctamente 🚀" });
});

// ==============================
// 🧠 Conexión a MongoDB Atlas
// ==============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    logger.info("✅ Conexión a MongoDB establecida");

    if (process.env.NODE_ENV !== "test") {
      const { startSchedulers } = await import("./utils/scheduler.js");
      if (typeof startSchedulers === "function") startSchedulers();
      else logger.warn("⚠️ startSchedulers no está definido en scheduler.js");
    }
  })
  .catch((err) => logger.error(`❌ Error al conectar a MongoDB: ${err.message}`));

// ==============================
// ⚡ Configuración de Socket.IO
// ==============================
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: allowedOrigins, credentials: true },
});

// 📦 Importamos modelos
import Message from "./models/Message.js";
import Notification from "./models/Notification.js";

// 🔔 Gestión de conexiones Socket.IO
io.on("connection", (socket) => {
  logger.info(`🟢 Usuario conectado: ${socket.id}`);
  updateActiveSockets(io.engine.clientsCount);

  socket.on("joinRoom", (room) => {
    socket.join(room);
    logger.debug(`📩 Usuario unido a sala: ${room}`);
  });

  socket.on("sendMessage", async (data) => {
    try {
      const { serviceId, sender, receiver, content } = data;
      const message = await Message.create({ serviceId, sender, receiver, content });
      io.to(`room_service_${serviceId}`).emit("newMessage", message);
      logger.info(`💬 Mensaje emitido en room_service_${serviceId}`);
    } catch (error) {
      logger.error(`❌ Error al enviar mensaje: ${error.message}`);
    }
  });

  socket.on("markNotificationsRead", async (userId) => {
    await Notification.updateMany({ user: userId, read: false }, { read: true });
    logger.info(`✅ Notificaciones marcadas como leídas para user ${userId}`);
  });

  socket.on("updateLocation", (data) => {
    io.emit("professionalMoved", data);
    logger.debug("📍 Ubicación de profesional actualizada");
  });

  socket.on("disconnect", () => {
    updateActiveSockets(io.engine.clientsCount);
    logger.info(`🔴 Usuario desconectado: ${socket.id}`);
  });
});

// 🧠 Exportamos la instancia de Socket.IO
export { io };

// ==============================
// 🧩 Middleware global de errores
// ==============================
app.use((err, req, res, next) => {
  logger.error(`❌ Error en ${req.method} ${req.url} → ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Error interno del servidor",
  });
});

// ==============================
// 🚦 Arranque del servidor
// ==============================
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 4000;
  server.listen(PORT, () => {
    logger.info(`🔥 Servidor corriendo en http://localhost:${PORT}`);
  });
}

// ✅ Exportamos el servidor para Jest / Supertest
export default server;

import { applySanitization } from "./middlewares/sanitize.middleware.js";

// 🧼 Sanitización global de entradas (XSS + Mongo Injection)
applySanitization(app);

import { antifraudMiddleware } from "./middlewares/antifraud.middleware.js";

// 🧠 Middleware antifraude global (detección de comportamiento sospechoso)
app.use(antifraudMiddleware);


import aiSecurityRoutes from "./routes/aiSecurity.routes.js";
app.use("/api", aiSecurityRoutes);

import { startSchedulers } from "./utils/scheduler.js";


if (process.env.NODE_ENV !== "test") {
  startSchedulers();
}

