// =======================================
// 💬 Chat Direct Controller — ServiGo
// =======================================
import ChatDirect from "../models/ChatDirect.js";

/* =======================================
   🟢 Crear o recuperar chat directo
======================================= */
export const createOrGetDirectChat = async (req, res) => {
  try {
    const clientId = req.user.id;
    const { professionalId } = req.body;

    if (!professionalId) {
      return res.status(400).json({ message: "Falta el ID del profesional" });
    }

    const chat = await ChatDirect.findOrCreate(clientId, professionalId);
    return res.status(200).json({ success: true, chatId: chat._id });
  } catch (error) {
    console.error("❌ Error al crear/obtener chat directo:", error);
    return res.status(500).json({
      success: false,
      message: "Error al crear o recuperar el chat directo",
    });
  }
};

/* =======================================
   💬 Obtener mensajes de un chat directo
======================================= */
export const getDirectMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await ChatDirect.findById(chatId).populate(
      "messages.sender",
      "name email"
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat no encontrado" });
    }

    return res.status(200).json({
      success: true,
      messages: chat.messages,
    });
  } catch (error) {
    console.error("❌ Error al obtener mensajes directos:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener mensajes directos",
    });
  }
};

/* =======================================
   📬 Obtener todos los chats directos del usuario autenticado
======================================= */
export const getUserDirectChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await ChatDirect.find({
      $or: [{ client: userId }, { professional: userId }],
    })
      .populate("client", "name email role")
      .populate("professional", "name email role")
      .sort({ updatedAt: -1 });

    // 🧩 Formatear respuesta para el frontend
    const formatted = chats.map((chat) => {
      const isClient = chat.client._id.toString() === userId;
      const partner = isClient ? chat.professional : chat.client;
      const lastMessage = chat.messages?.at(-1);

      return {
        _id: chat._id,
        partner: {
          _id: partner._id,
          name: partner.name,
          role: partner.role,
          email: partner.email,
        },
        lastMessage: lastMessage ? lastMessage.text : "Sin mensajes aún",
        lastDate: lastMessage ? lastMessage.createdAt : chat.createdAt,
        messageCount: chat.messages.length,
      };
    });

    return res.status(200).json({ success: true, chats: formatted });
  } catch (error) {
    console.error("❌ Error al obtener chats directos:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error al obtener chats" });
  }
};
