// =======================================
// 💬 Chat Controller — ServiGo (Optimizado)
// =======================================

import Message from "../models/Message.js";
import Service from "../models/Service.js";
import { io } from "../index.js";

/* =======================================
   🟢 Obtener todos los chats del usuario
======================================= */
export const getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar servicios donde participa el usuario
    const services = await Service.find({
      $or: [{ client: userId }, { professional: userId }],
    })
      .populate("client", "name email")
      .populate("professional", "name email")
      .sort({ updatedAt: -1 });

    // Construir lista de chats
    const chatList = await Promise.all(
      services.map(async (service) => {
        const lastMessage = await Message.findOne({ serviceId: service._id })
          .sort({ createdAt: -1 })
          .populate("sender", "name")
          .populate("receiver", "name");

        const unreadCount = await Message.countDocuments({
          serviceId: service._id,
          receiver: userId,
          read: false,
        });

        const isClient = service.client._id.toString() === userId;
        const chatUser = isClient ? service.professional : service.client;

        return {
          serviceId: service._id,
          user: {
            _id: chatUser._id,
            name: chatUser.name,
            email: chatUser.email,
          },
          lastMessage: lastMessage ? lastMessage.content : "Sin mensajes aún",
          lastDate: lastMessage ? lastMessage.createdAt : service.createdAt,
          unreadCount,
        };
      })
    );

    res.status(200).json(chatList);
  } catch (error) {
    console.error("❌ Error al obtener lista de chats:", error);
    res.status(500).json({ error: "Error al obtener los chats del usuario" });
  }
};

/* =======================================
   💬 Obtener mensajes por serviceId
======================================= */
export const getChatMessages = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const messages = await Message.find({ serviceId })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("❌ Error al obtener mensajes:", error);
    res.status(500).json({ error: "Error al obtener los mensajes del chat" });
  }
};

/* =======================================
   📨 Enviar nuevo mensaje (en tiempo real)
======================================= */
export const sendChatMessage = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { content } = req.body;
    const senderId = req.user.id;

    if (!content?.trim()) {
      return res.status(400).json({ error: "El mensaje no puede estar vacío" });
    }

    const service = await Service.findById(serviceId)
      .populate("client", "name email")
      .populate("professional", "name email");

    if (!service) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }

    // Determinar el receptor según el rol del remitente
    const receiverId =
      senderId === service.professional._id.toString()
        ? service.client._id
        : service.professional._id;

    // Crear mensaje
    const message = await Message.create({
      serviceId,
      sender: senderId,
      receiver: receiverId,
      content,
    });

    // Actualizar timestamp del servicio (orden en lista de chats)
    await Service.findByIdAndUpdate(serviceId, { updatedAt: new Date() });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name email")
      .populate("receiver", "name email");

    // 🔵 Emitir nuevo mensaje al room correspondiente
    io.to(`room_service_${serviceId}`).emit("newMessage", populatedMessage);

    console.log(
      `📩 Nuevo mensaje en room_service_${serviceId} →`,
      populatedMessage.content
    );

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("❌ Error al enviar mensaje:", error);
    res.status(500).json({ error: "Error al enviar mensaje" });
  }
};

/* =======================================
   🟠 Marcar mensajes como leídos
======================================= */
export const markMessageAsRead = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const userId = req.user.id;

    const updated = await Message.updateMany(
      { serviceId, receiver: userId, read: false },
      { $set: { read: true } }
    );

    // 🔄 Emitir evento de lectura a la room del servicio
    io.to(`room_service_${serviceId}`).emit("messagesMarkedAsRead", {
      serviceId,
      userId,
      count: updated.modifiedCount,
    });

    console.log(
      `👁️‍🗨️ ${updated.modifiedCount} mensajes marcados como leídos por ${userId}`
    );

    res.status(200).json({
      success: true,
      message: `${updated.modifiedCount} mensajes marcados como leídos ✅`,
    });
  } catch (error) {
    console.error("❌ Error al marcar mensajes como leídos:", error);
    res.status(500).json({ error: "Error al marcar mensajes como leídos" });
  }
};
