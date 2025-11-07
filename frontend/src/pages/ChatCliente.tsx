"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@/hooks/useChat";
import {
  SendHorizonal,
  Paperclip,
  Loader2,
  X,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/context/authContext";
import { uploadFile } from "@/api/upload";
import ImageViewer from "@/components/common/ImageViewer";

/* ============================================================
   🧩 Tipado fuerte
============================================================ */
interface Message {
  _id: string;
  sender: { _id: string };
  receiver: { _id: string };
  content: string;
  createdAt: string;
  read?: boolean;
}

interface User {
  _id?: string;
  id?: string;
  email: string;
}

/* ============================================================
   💬 ChatCliente — vista de chat para clientes
============================================================ */
export default function ChatCliente(): JSX.Element {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const {
    messages,
    handleSend,
    handleTyping,
    typingUser,
    isUserOnline,
    loading,
  } = useChat(serviceId!);

  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  const { user, token } = useAuth();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const userId: string | undefined = user?._id ?? (user as User)?.id;

  /* ============================================================
     🔽 Scroll automático al final del chat
  ============================================================ */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ============================================================
     🖼️ Filtrar imágenes del chat
  ============================================================ */
  const imageMessages = messages
    .filter((m) => /\.(jpeg|jpg|png|webp)$/i.test(m.content))
    .map((m) => m.content);

  /* ============================================================
     📤 Manejadores de archivos
  ============================================================ */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);

    if (selected.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(selected);
    } else {
      setPreview(null);
    }
  };

  const handleSendFile = async (): Promise<void> => {
    if (!file || !token) return;
    try {
      setUploading(true);
      const url = await uploadFile(file, token);
      await handleSend(`📎 Archivo enviado: ${url}`);
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error("❌ Error al subir archivo:", err);
    } finally {
      setUploading(false);
    }
  };

  /* ============================================================
     🌀 Loader mientras carga el chat
  ============================================================ */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-600 via-cyan-400 to-green-300">
        <p className="text-white/80 text-lg animate-pulse">
          Cargando chat...
        </p>
      </div>
    );
  }

  /* ============================================================
     🎨 Render principal
  ============================================================ */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen bg-linear-to-br from-blue-600 via-cyan-400 to-green-300"
    >
      {/* 🧭 Header */}
      <header className="p-4 bg-white/20 backdrop-blur-lg text-white shadow flex justify-between items-center sticky top-0 z-10">
        <button
          onClick={() => navigate("/chats")}
          className="flex items-center gap-2 text-white/80 hover:text-white transition"
        >
          <ArrowLeft size={18} /> Volver
        </button>
        <div className="text-center flex-1">
          <h2 className="font-semibold">Chat con tu profesional</h2>
          <p
            className={`text-xs mt-1 ${
              isUserOnline(messages[0]?.receiver?._id)
                ? "text-green-300"
                : "text-gray-300"
            }`}
          >
            {isUserOnline(messages[0]?.receiver?._id)
              ? "En línea"
              : "Desconectado"}
          </p>
        </div>
      </header>

      {/* 💬 Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-transparent">
        <AnimatePresence>
          {messages.map((msg) => {
            const isMine = msg.sender._id === userId;
            const isImage = /\.(jpeg|jpg|png|webp)$/i.test(msg.content);
            const isLink = msg.content.includes("http");

            return (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-md ${
                    isMine
                      ? "bg-linear-to-br from-blue-500 to-cyan-500 text-white rounded-br-none"
                      : "bg-white/90 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {isImage ? (
                    <img
                      src={msg.content}
                      alt="imagen enviada"
                      onClick={() =>
                        setSelectedImageIndex(
                          imageMessages.indexOf(msg.content)
                        )
                      }
                      className="rounded-lg shadow-sm max-h-60 mb-2 cursor-pointer hover:opacity-90 transition"
                    />
                  ) : isLink ? (
                    <a
                      href={msg.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-sm break-words"
                    >
                      {msg.content}
                    </a>
                  ) : (
                    <p className="text-sm break-words">{msg.content}</p>
                  )}
                  <span className="text-xs opacity-70 block text-right mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    {msg.read && "✅"}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {typingUser && (
          <p className="text-white/80 text-sm italic mt-2 text-center animate-pulse">
            {typingUser}
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 📝 Input */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (file) {
            await handleSendFile();
          } else if (newMessage.trim()) {
            await handleSend(newMessage.trim());
          }
          setNewMessage("");
        }}
        className="p-4 flex flex-col gap-2 bg-white/10 backdrop-blur-lg border-t border-white/20"
      >
        {preview && (
          <div className="relative w-32 mx-auto">
            <img
              src={preview}
              alt="preview"
              className="rounded-lg shadow-lg border border-white/20"
            />
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setPreview(null);
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <label className="cursor-pointer p-3 rounded-xl bg-white/20 hover:bg-white/30 transition">
            <Paperclip className="text-white" size={18} />
            <input
              type="file"
              accept="image/*,application/pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-2 rounded-xl outline-none bg-white/70 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-cyan-400"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={uploading}
            className="p-3 bg-linear-to-br from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-xl transition"
          >
            {uploading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <SendHorizonal size={18} />
            )}
          </motion.button>
        </div>
      </form>

      {/* 🖼️ Visor de imágenes */}
      {selectedImageIndex !== null && (
        <ImageViewer
          images={imageMessages}
          initialIndex={selectedImageIndex}
          onClose={() => setSelectedImageIndex(null)}
        />
      )}
    </motion.div>
  );
}
