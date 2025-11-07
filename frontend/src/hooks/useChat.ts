// =============================================
// 🧩 Hook — useChat.ts (Socket.IO con lectura, typing y estado online)
// =============================================

import { useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import {
  getChatMessages,
  sendChatMessage,
  markMessagesAsRead,
  Message,
} from "@/api/chat";
import { useAuth } from "@/context/authContext";

// ✅ Tipo seguro para timeout
type TimeoutType = ReturnType<typeof setTimeout>;

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "";

export const useChat = (serviceId: string) => {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const typingTimeout = useRef<TimeoutType | null>(null);

  const userId: string | undefined =
    (user as { _id?: string; id?: string })?._id ||
    (user as { id?: string })?.id;

  /* =======================================================
     🚀 Inicializar conexión Socket.IO
  ======================================================= */
  useEffect(() => {
    if (!token || !serviceId) return;

    const socketInstance: Socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
    });

    setSocket(socketInstance);
    socketInstance.emit("joinRoom", `room_service_${serviceId}`);
    if (userId) socketInstance.emit("userOnline", userId);

    /* =======================================================
       📩 Listeners
    ======================================================= */
    const handleNewMessage = (msg: Message) => {
      // Evita duplicar mensajes
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === msg._id);
        return exists ? prev : [...prev, msg];
      });
    };

    const handleMessagesRead = ({
      serviceId: updatedId,
      userId: readerId,
    }: {
      serviceId: string;
      userId: string;
    }) => {
      if (updatedId === serviceId && readerId !== userId) {
        setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
      }
    };

    const handleTyping = ({ userId: writerId }: { userId: string }) => {
      if (writerId !== userId) setTypingUser("escribiendo...");
    };

    const handleStopTyping = ({ userId: writerId }: { userId: string }) => {
      if (writerId !== userId) setTypingUser(null);
    };

    const handleOnlineUsers = (users: string[]) => {
      setOnlineUsers(users);
    };

    // ✅ Registrar eventos una sola vez
    socketInstance.on("newMessage", handleNewMessage);
    socketInstance.on("messagesMarkedAsRead", handleMessagesRead);
    socketInstance.on("userTyping", handleTyping);
    socketInstance.on("userStopTyping", handleStopTyping);
    socketInstance.on("updateOnlineUsers", handleOnlineUsers);

    /* =======================================================
       🔄 Cleanup seguro (evita duplicados)
    ======================================================= */
    return () => {
      socketInstance.off("newMessage", handleNewMessage);
      socketInstance.off("messagesMarkedAsRead", handleMessagesRead);
      socketInstance.off("userTyping", handleTyping);
      socketInstance.off("userStopTyping", handleStopTyping);
      socketInstance.off("updateOnlineUsers", handleOnlineUsers);

      socketInstance.emit("leaveRoom", `room_service_${serviceId}`);
      socketInstance.disconnect();
    };
  }, [token, serviceId, userId]);

  /* =======================================================
     📥 Cargar mensajes iniciales
  ======================================================= */
  const fetchMessages = useCallback(async () => {
    if (!token || !serviceId) return;

    try {
      const msgs = await getChatMessages(serviceId, token);
      setMessages(msgs);

      await markMessagesAsRead(serviceId, token);
      socket?.emit("markAsRead", { serviceId, userId });
    } catch (error) {
      console.error("❌ Error al cargar mensajes:", error);
    } finally {
      setLoading(false);
    }
  }, [token, serviceId, socket, userId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  /* =======================================================
     ✉️ Enviar mensaje
  ======================================================= */
  const handleSend = async (content: string): Promise<void> => {
    if (!token || !content.trim()) return;

    try {
      const msg = await sendChatMessage(serviceId, content, token);
      // ⚙️ Emitir pero no volver a añadir localmente
      socket?.emit("sendMessage", msg);
    } catch (error) {
      console.error("❌ Error al enviar mensaje:", error);
    }
  };

  /* =======================================================
     ✍️ Indicador de escritura
  ======================================================= */
  const handleTyping = (): void => {
    if (!socket || !userId) return;
    socket.emit("typing", { serviceId, userId });

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", { serviceId, userId });
    }, 2000);
  };

  /* =======================================================
     🟢 Helper: comprobar si usuario está online
  ======================================================= */
  const isUserOnline = (id?: string): boolean => {
    if (!id) return false;
    return onlineUsers.includes(id);
  };

  /* =======================================================
     🧩 Retorno del hook
  ======================================================= */
  return {
    messages,
    handleSend,
    handleTyping,
    typingUser,
    isUserOnline,
    loading,
  };
};
