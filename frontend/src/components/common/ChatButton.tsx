"use client";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";

/* ==========================================
   💬 Botón flotante de Chat Global — ServiGo
   ========================================== */
export default function ChatButton() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Si el usuario no está autenticado, no mostrar el botón
  if (!user) return null;

  return (
    <motion.button
      onClick={() => navigate("/chats")}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center bg-gradient-to-br from-emerald-500 via-teal-400 to-cyan-400 text-white shadow-lg shadow-emerald-700/40 rounded-full w-14 h-14 cursor-pointer"
      aria-label="Abrir chat"
    >
      <MessageCircle className="w-7 h-7" />
    </motion.button>
  );
}
