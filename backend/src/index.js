// ==============================
// 🌍 ServiGo Backend (v1.0)
// ==============================

// 📦 Librerías principales
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

// ⚙️ Variables de entorno
dotenv.config();

// 🚀 Inicializamos Express
const app = express();

// ==============================
// 🛡️ Seguridad avanzada (Punto 31)
// ==============================

const allowedOrigins = [
  "http://localhost:5173",
  "https://servigo.app",
  "https://www.servigo.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ Origen no permitido por CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};

const helmetConfig = helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:", "wss:"],
      fontSrc: ["'self'", "https:", "data:"],
      frameSrc: ["'none'"],
    },
  },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  frameguard: { action: "deny" },
});

import { limiter, speedLimiter } from "./middlewares/rateLimit.middleware.js";

app.use(helmetConfig);
app.use(cors(corsOptions));
app.use(limiter);
app.use(speedLimiter);

// ==============================
// 📊 Métricas en tiempo real
// ==============================
import { recordRequest, updateActiveSockets } from "./services/metrics.service.js";

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const responseTime = Date.now() - start;
    recordRequest(res.statusCode, responseTime);
  });
  next();
});

// ==============================
// 🧩 Middlewares globales
// ==============================
app.use(express.json());
app.use(morgan("dev"));

import { sanitizeMiddleware } from "./middlewares/sanitize.middleware.js";
app.use(sanitizeMiddleware);

import { antifraudMiddleware } from "./middlewares/antifraud.middleware.js";
app.use(antifraudMiddleware);

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
import aiRoutes from "./routes/ai.routes.js";
import aiLogRoutes from "./routes/aiLog.routes.js";
import aiSecurityRoutes from "./routes/aiSecurity.routes.js";
import metricsRoutes from "./routes/metrics.routes.js";

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
app.use("/api/ai/security", aiSecurityRoutes);
app.use("/api/metrics", metricsRoutes);

// 🌍 Endpoint rápido de test
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

import Message from "./models/Message.js";
import Notification from "./models/Notification.js";

// ==============================
// 🔔 Gestión de eventos Socket.IO
// ==============================
const onlineUsers = new Map(); // { userId: socketId }

io.on("connection", (socket) => {
  logger.info(`🟢 Usuario conectado: ${socket.id}`);
  updateActiveSockets(io.engine.clientsCount);

  // 🏠 Unirse a salas dinámicas
  socket.on("joinRoom", (room) => {
    socket.join(room);
    logger.debug(`📩 Usuario unido a sala: ${room}`);
  });

  // 💬 Enviar mensajes
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

  // 🔔 Notificaciones leídas
  socket.on("markNotificationsRead", async (userId) => {
    await Notification.updateMany({ user: userId, read: false }, { read: true });
    logger.info(`✅ Notificaciones marcadas como leídas para user ${userId}`);
  });

  // 📍 Actualización de ubicación
  socket.on("updateLocation", (data) => {
    io.emit("professionalMoved", data);
    logger.debug("📍 Ubicación de profesional actualizada");
  });

  // ==============================
  // 🟢 Sistema de presencia y escritura
  // ==============================
  socket.on("userOnline", (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit("updateOnlineUsers", Array.from(onlineUsers.keys()));
  });

  socket.on("userTyping", ({ room, user }) => {
    socket.to(room).emit("displayTyping", { user });
  });

  // 🚪 Desconexión
  socket.on("disconnect", () => {
    for (const [userId, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit("updateOnlineUsers", Array.from(onlineUsers.keys()));
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

export default server;
// 📂 Servir archivos estáticos
import path from "path";
app.use("/uploads", express.static(path.resolve("uploads")));

import uploadRoutes from "./routes/upload.routes.js";
app.use("/api/upload", uploadRoutes);

import chatRoutes from "./routes/chat.routes.js";
app.use("/api/chats", chatRoutes);

