"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/authContext";
import { getUserChats } from "@/api/chat";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

/* =======================================
   🔹 Tipos estrictos
======================================= */
interface ChatUser {
  _id: string;
  name: string;
  email?: string;
  role?: string;
}

interface ChatPreview {
  user: ChatUser;
  lastMessage: string;
  lastDate: string;
  unreadCount: number;
  serviceId: string;
}

interface ChatMessage {
  _id: string;
  serviceId: string;
  sender: ChatUser;
  receiver: ChatUser;
  content: string;
  createdAt: string;
  read: boolean;
}

interface AuthUser {
  _id?: string;
  id?: string;
  name?: string;
}

/* =======================================
   💬 Componente principal — Chats
======================================= */
export default function Chats() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const userTyped = user as AuthUser;
  const userId: string | undefined = userTyped?._id || userTyped?.id;

  const SOCKET_URL: string =
    import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "";

  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  /* =======================================
     🚀 Cargar lista inicial de chats
  ======================================= */
  const fetchChats = useCallback(async () => {
    if (!token) return;
    try {
      const response = await getUserChats(token);

      // ✅ Normalizamos garantizando que unreadCount sea número
      const normalized: ChatPreview[] = response.map((chat: Partial<ChatPreview>) => ({
        user: chat.user!,
        lastMessage: chat.lastMessage ?? "",
        lastDate: chat.lastDate ?? new Date().toISOString(),
        unreadCount: chat.unreadCount ?? 0,
        serviceId: chat.serviceId!,
      }));

      setChats(normalized);
    } catch (error) {
      console.error("❌ Error al cargar chats:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  /* =======================================
     🔌 Conexión Socket.IO
  ======================================= */
  useEffect(() => {
    if (!token) return;

    const s: Socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    setSocket(s);

    // 📩 Nuevo mensaje recibido
    s.on("newMessage", (msg: ChatMessage) => {
      setChats((prevChats) => {
        const updated = [...prevChats];
        const existingIndex = updated.findIndex(
          (c) => c.serviceId === msg.serviceId
        );
        const isMine = msg.sender._id === userId;

        if (existingIndex !== -1) {
          const chat = updated[existingIndex];
          updated[existingIndex] = {
            ...chat,
            lastMessage: msg.content,
            lastDate: msg.createdAt,
            unreadCount: isMine ? chat.unreadCount : chat.unreadCount + 1,
          };
        } else {
          updated.unshift({
            user: msg.sender,
            lastMessage: msg.content,
            lastDate: msg.createdAt,
            unreadCount: isMine ? 0 : 1,
            serviceId: msg.serviceId,
          });
        }

        return updated.sort(
          (a, b) =>
            new Date(b.lastDate).getTime() - new Date(a.lastDate).getTime()
        );
      });

      if (msg.sender._id !== userId) {
        toast.message("💬 Nuevo mensaje", {
          description:
            msg.content.length > 80
              ? msg.content.slice(0, 80) + "…"
              : msg.content,
        });
      }
    });

    // ✅ Mensajes marcados como leídos
    s.on(
      "messagesMarkedAsRead",
      ({
        serviceId: updatedId,
        userId: readerId,
      }: {
        serviceId: string;
        userId: string;
      }) => {
        if (readerId !== userId) {
          setChats((prev) =>
            prev.map((c) =>
              c.serviceId === updatedId ? { ...c, unreadCount: 0 } : c
            )
          );
        }
      }
    );

    return () => {
      s.disconnect();
    };
  }, [token, userId, SOCKET_URL]);

  /* =======================================
     📲 Abrir chat
  ======================================= */
  const handleOpenChat = (chat: ChatPreview): void => {
    socket?.emit("markAsRead", { serviceId: chat.serviceId, userId });
    setChats((prev) =>
      prev.map((c) =>
        c.serviceId === chat.serviceId ? { ...c, unreadCount: 0 } : c
      )
    );
    navigate(`/chat/${chat.serviceId}`);
  };

  /* =======================================
     🎨 UI — Lista de Chats
  ======================================= */
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex flex-col items-center bg-linear-to-br from-blue-600 via-cyan-400 to-green-300 p-8 text-white"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-3xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          💬 Tus conversaciones
        </h1>

        {chats.length === 0 ? (
          <p className="text-center text-white/70">No tienes chats activos.</p>
        ) : (
          <ul className="space-y-4">
            <AnimatePresence>
              {chats.map((chat) => (
                <motion.li
                  key={chat.serviceId}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => handleOpenChat(chat)}
                  className="bg-white/20 hover:bg-white/30 cursor-pointer rounded-xl p-4 flex justify-between items-center transition-all"
                >
                  <div>
                    <p className="font-semibold">{chat.user.name}</p>
                    <p className="text-sm text-white/80 line-clamp-1">
                      {chat.lastMessage || "Sin mensajes aún"}
                    </p>
                    <p className="text-xs text-white/60 mt-1">
                      {new Date(chat.lastDate).toLocaleString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "short",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {chat.unreadCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.25 }}
                        className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md"
                      >
                        {chat.unreadCount}
                      </motion.span>
                    )}
                    <MessageCircle className="w-6 h-6 opacity-80" />
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </motion.div>
  );
}
