"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/authContext";
import { MessageCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ChatPreview {
  _id: string;
  partner: { _id: string; name: string; role: string; email: string };
  lastMessage: string;
  lastDate: string;
  messageCount: number;
}

export default function Mensajes() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/direct-chats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (data.success) setChats(data.chats);
      } catch (error) {
        console.error("❌ Error cargando chats:", error);
        toast.error("No se pudieron cargar los chats");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchChats();
  }, [token]);

  const handleOpenChat = (chatId: string) => {
    navigate(`/chat/${chatId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-600 via-cyan-400 to-green-300 p-8 text-white"
    >
      <h1 className="text-3xl font-bold text-center mb-8">💬 Mensajes</h1>

      {loading ? (
        <div className="flex justify-center mt-20">
          <Loader2 className="animate-spin w-8 h-8" />
        </div>
      ) : chats.length === 0 ? (
        <p className="text-center text-white/80">No tienes chats activos.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {chats.map((chat) => (
              <motion.div
                key={chat._id}
                whileHover={{ scale: 1.02 }}
                className="bg-white/20 backdrop-blur-lg p-5 rounded-2xl shadow-lg flex flex-col justify-between border border-white/10"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-1">
                    {chat.partner.name}
                  </h2>
                  <p className="text-white/80 text-sm mb-2">
                    {chat.partner.role}
                  </p>
                  <p className="text-sm mb-3 truncate">{chat.lastMessage}</p>
                  <p className="text-xs text-white/70">
                    {new Date(chat.lastDate).toLocaleString("es-ES")}
                  </p>
                </div>
                <button
                  onClick={() => handleOpenChat(chat._id)}
                  className="mt-4 flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold py-2 px-4 rounded-xl hover:bg-blue-50 transition"
                >
                  <MessageCircle className="w-5 h-5" />
                  Abrir chat
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
