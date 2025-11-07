"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { useAuth } from "@/context/authContext";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import { toast } from "sonner";

/* =======================================================
   🧠 Tipado fuerte
======================================================= */
interface Sender {
  _id: string;
  name: string;
}

interface Message {
  _id?: string;
  sender: Sender;
  text: string;
  createdAt: string;
}

/* =======================================================
   💬 Chat directo (cliente ↔ profesional)
======================================================= */
export default function ChatDirect() {
  const { token, user } = useAuth();
  const { chatId } = useParams<{ chatId: string }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [typing, setTyping] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /* =======================================================
     🔌 Conexión con Socket.IO
  ======================================================= */
  useEffect(() => {
    if (!chatId || !token) return;

    const socket = io(import.meta.env.VITE_API_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socket.emit("joinDirectChat", { chatId });
    socketRef.current = socket;

    // 📩 Escuchar mensajes nuevos
    socket.on("receiveDirectMessage", (msg: Message) => {
      setMessages((prev: Message[]) => [...prev, msg]);
    });

    // 💭 Escuchar estado "escribiendo"
    socket.on("userTypingDirect", () => setPartnerTyping(true));
    socket.on("userStopTypingDirect", () => setPartnerTyping(false));

    return () => {
      socket.disconnect();
    };
  }, [chatId, token]);

  /* =======================================================
     📡 Cargar historial de mensajes
  ======================================================= */
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/direct-chats/${chatId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data?.success) {
          setMessages(data.messages as Message[]);
        }
      } catch (error) {
        console.error("❌ Error al cargar mensajes:", error);
        toast.error("Error al cargar el historial del chat.");
      }
    };

    if (token) fetchMessages();
  }, [chatId, token]);

  /* =======================================================
     ✉️ Enviar mensaje
  ======================================================= */
  const handleSendMessage = () => {
    if (!newMessage.trim() || !socketRef.current || !user?._id) return;

    const safeSender: Sender = {
      _id: user._id ?? "",
      name: user.name ?? "Usuario",
    };

    const messageData: Message = {
      sender: safeSender,
      text: newMessage.trim(),
      createdAt: new Date().toISOString(),
    };

    socketRef.current.emit("sendDirectMessage", {
      chatId,
      sender: safeSender,
      text: newMessage.trim(),
    });

    setMessages((prev: Message[]) => [...prev, messageData]);
    setNewMessage("");
    stopTyping();
  };

  /* =======================================================
     💭 Emitir “escribiendo” y “dejar de escribir”
  ======================================================= */
  const emitTyping = () => {
    if (!socketRef.current || typing || !user?._id) return;
    setTyping(true);
    socketRef.current.emit("typingDirect", { chatId, userId: user._id });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(stopTyping, 2000);
  };

  const stopTyping = () => {
    if (!socketRef.current || !typing || !user?._id) return;
    setTyping(false);
    socketRef.current.emit("stopTypingDirect", { chatId, userId: user._id });
  };

  /* =======================================================
     📜 Autoscroll
  ======================================================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =======================================================
     🎨 Render UI
  ======================================================= */
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-blue-700 to-indigo-800 text-white">
      {/* 🔹 Header */}
      <header className="p-4 text-center bg-blue-900 shadow-lg text-lg font-semibold">
        Chat directo
      </header>

      {/* 💬 Mensajes */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${
              msg.sender._id === user?._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-xl shadow-md ${
                msg.sender._id === user?._id
                  ? "bg-emerald-500 text-white"
                  : "bg-white/20 text-white"
              }`}
            >
              <p className="text-sm mb-1">{msg.sender.name}</p>
              <p>{msg.text}</p>
              <p className="text-xs text-white/70 mt-1 text-right">
                {new Date(msg.createdAt).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </motion.div>
        ))}

        {/* 💭 Indicador “escribiendo…” */}
        <AnimatePresence>
          {partnerTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm italic text-white/70 px-4 py-2"
            >
              💬 El otro usuario está escribiendo...
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* 📝 Input */}
      <footer className="p-4 bg-blue-900 flex items-center gap-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            emitTyping();
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Escribe un mensaje..."
          className="flex-1 px-4 py-2 rounded-lg text-gray-900 focus:outline-none"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSendMessage}
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg p-2"
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </footer>
    </div>
  );
}
