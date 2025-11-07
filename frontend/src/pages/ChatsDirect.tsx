"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Clock, Loader2 } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";

/* ===========================================================
   🧩 Tipado fuerte
=========================================================== */
interface ChatUser {
  _id: string;
  name: string;
  email: string;
  role: "cliente" | "profesional" | "admin";
}

interface ChatItem {
  _id: string;
  partner: ChatUser;
  lastMessage: string;
  lastDate: string;
  messageCount: number;
}

/* ===========================================================
   💬 Lista de chats directos
=========================================================== */
const ChatsDirect: React.FC = () => {
  const { token } = useAuth();
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ===========================================================
     🔁 Cargar lista de chats
  ============================================================ */
  useEffect(() => {
    const fetchChats = async () => {
      if (!token) return;
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/direct-chats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (data.success) {
          setChats(data.chats);
        } else {
          toast.error("Error al obtener los chats");
        }
      } catch (error) {
        console.error("❌ Error al cargar chats:", error);
        toast.error("No se pudieron cargar los chats.");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [token]);

  /* ===========================================================
     🕓 Utilidad: formatear fecha
  ============================================================ */
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "Sin fecha";
    const date = new Date(dateStr);
    return date.toLocaleString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
    });
  };

  /* ===========================================================
     🎨 UI principal
  ============================================================ */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-700 to-indigo-800 text-white">
        <Loader2 className="animate-spin w-10 h-10" />
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-700 to-indigo-800 text-white">
        <MessageSquare className="w-10 h-10 mb-3" />
        <p className="text-lg font-medium text-white/80">
          No tienes chats activos aún.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-700 to-indigo-800 p-6 text-white">
      <h1 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2">
        <MessageSquare className="w-7 h-7" />
        Tus Chats Directos
      </h1>

      <AnimatePresence>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {chats.map((chat, index) => (
            <motion.div
              key={chat._id || index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              onClick={() => navigate(`/chat-direct/${chat._id}`)}
              className="cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-lg hover:bg-white/15 transition"
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold text-white truncate">
                  {chat.partner.name}
                </h2>
                <p className="text-sm text-white/70 truncate">
                  {chat.partner.email}
                </p>
                <p className="text-sm mt-1 truncate text-white/90 italic">
                  {chat.lastMessage || "Sin mensajes aún"}
                </p>

                <div className="flex justify-between items-center mt-3 text-xs text-white/60">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDate(chat.lastDate)}
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-200 px-2 py-0.5 rounded-full text-[11px]">
                    {chat.messageCount} mensajes
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default ChatsDirect;
