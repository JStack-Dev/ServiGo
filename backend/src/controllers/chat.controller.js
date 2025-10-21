import Message from "../models/Message.js";
import User from "../models/User.js";

// 🟢 Obtener lista de chats activos del usuario
export const getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar conversaciones donde el usuario participe
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", userId] },
              "$receiver",
              "$sender",
            ],
          },
          lastMessage: { $first: "$content" },
          lastDate: { $first: "$createdAt" },
        },
      },
    ]);

    // Obtener datos de usuario para cada chat
    const populatedChats = await Promise.all(
      messages.map(async (chat) => {
        const user = await User.findById(chat._id, "name email role");
        return {
          user,
          lastMessage: chat.lastMessage,
          lastDate: chat.lastDate,
        };
      })
    );

    res.json(populatedChats);
  } catch (error) {
    console.error("❌ Error al obtener chats:", error);
    res.status(500).json({ error: "Error al obtener los chats" });
  }
};
