// ==============================
// 🌍 ServiGo Backend (v1.4)
// Real-time Sync + Bookings + Direct Chat + Notifications
// ==============================

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import helmet from "helmet";
import path from "path";
import { createServer } from "http";
import logger, { attachLoggerSocket } from "./config/logger.js";
import { initSocket } from "./config/socket.js";

// 📦 Modelos base
import Message from "./models/Message.js";
import Notification from "./models/Notification.js";
import Booking from "./models/Booking.js";
import ChatDirect from "./models/ChatDirect.js"; // ✅ nuevo modelo para chat directo

// ⚙️ Configuración de entorno
dotenv.config();

// 🚀 Inicializamos Express
const app = express();

// ==============================
// 🛡️ Seguridad avanzada
// ==============================
const allowedOrigins = [
  "http://localhost:5173",
  "https://servigo.vercel.app",
  "https://servi-go.vercel.app",
  "https://servi-go-nu7z.vercel.app",
  "https://servigo-04kk.onrender.com"
];



const corsOptions = {
  origin(origin, callback) {
    // ✅ Permite peticiones sin cabecera Origin (como OPTIONS preflight)
    if (!origin) {
      return callback(null, true);
    }

    // ✅ Permite solo los dominios seguros definidos
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`❌ Origen no permitido por CORS: ${origin}`);
    return callback(new Error("Origen no permitido por CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
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
      frameSrc: ["'none'"]
    }
  },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  frameguard: { action: "deny" }
});

import { limiter, speedLimiter } from "./middlewares/rateLimit.middleware.js";
import { sanitizeMiddleware } from "./middlewares/sanitize.middleware.js";
import { antifraudMiddleware } from "./middlewares/antifraud.middleware.js";
import { recordRequest, updateActiveSockets } from "./services/metrics.service.js";

// ==============================
// 🧱 Middlewares globales
// ==============================
app.use(helmetConfig);
app.use(cors(corsOptions));
app.use(limiter);
app.use(speedLimiter);
app.use(express.json());
app.use(morgan("dev"));
app.use(sanitizeMiddleware);
app.use(antifraudMiddleware);

// 📘 Logger de peticiones HTTP
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl}`, {
      statusCode: res.statusCode,
      responseTime: `${duration}ms`,
      userAgent: req.headers["user-agent"]
    });
  });
  next();
});

// 📊 Métricas
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const responseTime = Date.now() - start;
    recordRequest(res.statusCode, responseTime);
  });
  next();
});

// 📁 Archivos estáticos
app.use("/uploads", express.static(path.resolve("uploads")));

// ==============================
// 🔗 Rutas API
// ==============================
import authRoutes from "./routes/auth.routes.js";
import testRoutes from "./routes/test.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import urgencyRoutes from "./routes/urgency.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import userRoutes from "./routes/user.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import locationRoutes from "./routes/location.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import reportRoutes from "./routes/report.routes.js";
import logRoutes from "./routes/log.routes.js";
import messageRoutes from "./routes/message.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import aiLogRoutes from "./routes/aiLog.routes.js";
import aiSecurityRoutes from "./routes/aiSecurity.routes.js";
import metricsRoutes from "./routes/metrics.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import chatDirectRoutes from "./routes/chatDirect.routes.js"; // ✅ nuevo import

// 🧩 Registrar rutas base
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
app.use("/api/chats", chatRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/direct-chats", chatDirectRoutes);

app.get("/api", (req, res) => {
  res.json({ mensaje: "Servidor ServiGo funcionando correctamente 🚀" });
});

// ==============================
// 🧠 MongoDB Atlas
// ==============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    logger.info("✅ Conexión a MongoDB establecida");
    if (process.env.NODE_ENV !== "test") {
      const { startSchedulers } = await import("./utils/scheduler.js");
      if (typeof startSchedulers === "function") startSchedulers();
    }
  })
  .catch((err) =>
    logger.error(`❌ Error al conectar a MongoDB: ${err.message}`)
  );

// ==============================
// ⚡ Socket.IO — Configuración
// ==============================
const server = createServer(app);
const io = initSocket(server, allowedOrigins);
attachLoggerSocket(io);
export { io };

const onlineUsers = new Map();

io.on("connection", (socket) => {
  logger.info(`🟢 Usuario conectado: ${socket.id}`);
  updateActiveSockets(io.engine.clientsCount);

  // ===========================================
  // 💬 CHAT NORMAL (por servicio)
  // ===========================================
  socket.on("joinRoom", (room) => socket.join(room));

  socket.on("sendMessage", async ({ serviceId, sender, receiver, content }) => {
    try {
      const message = await Message.create({
        serviceId,
        sender,
        receiver,
        content
      });
      io.to(`room_service_${serviceId}`).emit("newMessage", message);
    } catch (error) {
      logger.error(`❌ Error al enviar mensaje: ${error.message}`);
    }
  });

  socket.on("markAsRead", async ({ serviceId, userId }) => {
    try {
      const updated = await Message.updateMany(
        { serviceId, receiver: userId, read: false },
        { $set: { read: true } }
      );
      if (updated.modifiedCount > 0) {
        io.to(`room_service_${serviceId}`).emit("messagesMarkedAsRead", {
          serviceId,
          userId
        });
        logger.info(`📘 ${updated.modifiedCount} mensajes marcados como leídos`);
      }
    } catch (error) {
      logger.error(`❌ Error al marcar mensajes como leídos: ${error.message}`);
    }
  });

  // ===========================================
  // 💬 CHAT DIRECTO (cliente ↔ profesional)
  // ===========================================
  socket.on("joinDirectChat", ({ chatId }) => {
    socket.join(`direct_${chatId}`);
    logger.info(`👥 Usuario unido a sala direct_${chatId}`);
  });

  socket.on("sendDirectMessage", async (msgData) => {
    try {
      const { chatId, text, sender } = msgData;
      const chat = await ChatDirect.findById(chatId);

      if (!chat) {
        logger.warn(`⚠️ Chat no encontrado: ${chatId}`);
        return;
      }

      const message = {
        sender,
        text,
        createdAt: new Date()
      };

      chat.messages.push(message);
      await chat.save();

      io.to(`direct_${chatId}`).emit("receiveDirectMessage", message);
      logger.info(`💬 Nuevo mensaje directo en chat ${chatId}`);
    } catch (error) {
      logger.error(`❌ Error en sendDirectMessage: ${error.message}`);
    }
  });

  // 💭 Estado "escribiendo..."
  socket.on("typingDirect", ({ chatId, userId }) => {
    socket.to(`direct_${chatId}`).emit("userTypingDirect", { userId });
  });

  socket.on("stopTypingDirect", ({ chatId, userId }) => {
    socket.to(`direct_${chatId}`).emit("userStopTypingDirect", { userId });
  });

  // ===========================================
  // 💭 Indicadores y notificaciones
  // ===========================================
  socket.on("typing", ({ serviceId, userId }) =>
    socket.to(`room_service_${serviceId}`).emit("userTyping", { userId })
  );

  socket.on("stopTyping", ({ serviceId, userId }) =>
    socket.to(`room_service_${serviceId}`).emit("userStopTyping", { userId })
  );

  socket.on("userOnline", (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit("updateOnlineUsers", Array.from(onlineUsers.keys()));
  });

  socket.on("booking:created", ({ professionalId, bookingId }) => {
    io.to(`room_user_${professionalId}`).emit("newNotification", {
      title: "Nueva reserva",
      message: `Tienes una nueva reserva #${bookingId} pendiente 🧾`,
      read: false,
      createdAt: new Date().toISOString()
    });
  });

  socket.on("booking:updated", ({ clientId, status }) => {
    io.to(`room_user_${clientId}`).emit("newNotification", {
      title: "Actualización de reserva",
      message:
        status === "completed"
          ? "Tu reserva ha sido completada ✅"
          : "Tu reserva ha sido cancelada ❌",
      read: false,
      createdAt: new Date().toISOString()
    });
  });

  // ===========================================
  // 🔴 Desconexión
  // ===========================================
  socket.on("disconnect", () => {
    for (const [userId, id] of onlineUsers.entries()) {
      if (id === socket.id) onlineUsers.delete(userId);
    }
    io.emit("updateOnlineUsers", Array.from(onlineUsers.keys()));
    updateActiveSockets(io.engine.clientsCount);
    logger.info(`🔴 Usuario desconectado: ${socket.id}`);
  });
});

// ==============================
// 🧩 Middleware de errores
// ==============================
app.use((err, req, res, next) => {
  logger.error(`❌ Error en ${req.method} ${req.url} → ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Error interno del servidor"
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
