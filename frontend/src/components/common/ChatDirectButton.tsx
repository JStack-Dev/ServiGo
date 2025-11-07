"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/authContext";

/* ==========================================================
   💬 Chat Direct Button — Acceso rápido a chats directos
========================================================== */

// 🧩 Tipado fuerte del chat esperado desde el backend
interface ChatSummary {
  _id: string;
  messageCount: number;
}

interface ApiResponse {
  success: boolean;
  chats: ChatSummary[];
}

/* ==========================================================
   🚀 Componente principal
========================================================== */
export default function ChatDirectButton(): React.JSX.Element | null {
  const { token } = useAuth();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();

  /* ==========================================================
     🧠 Evitar mostrar el botón dentro del propio chat
  =========================================================== */
  const hiddenRoutes = ["/chats-direct", "/chat-direct"];
  const shouldHide = hiddenRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  /* ==========================================================
     📡 Cargar cantidad de mensajes no leídos
  =========================================================== */
  useEffect(() => {
    const fetchUnread = async (): Promise<void> => {
      if (!token) return;
      try {
        const { data } = await axios.get<ApiResponse>(
          `${import.meta.env.VITE_API_URL}/api/direct-chats`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success && Array.isArray(data.chats)) {
          const totalUnread = data.chats.filter(
            (chat) => chat.messageCount > 0
          ).length;
          setUnreadCount(totalUnread);
        }
      } catch (error) {
        console.error("❌ Error al cargar chats directos:", error);
      }
    };

    fetchUnread();
  }, [token]);

  /* ==========================================================
     🎨 Render — Botón flotante
  =========================================================== */
  if (shouldHide) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-24 right-6 z-50"
    >
      <button
        type="button"
        onClick={() => navigate("/chats-direct")}
        className="relative bg-emerald-500 text-white p-4 rounded-full shadow-lg hover:bg-emerald-600 transition"
        aria-label="Abrir chats directos"
      >
        <MessageSquare className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
            {unreadCount}
          </span>
        )}
      </button>
    </motion.div>
  );
}
