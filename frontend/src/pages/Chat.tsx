"use client";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/authContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

interface Message {
  _id?: string;
  sender: string;
  receiver: string;
  content: string;
  createdAt?: string;
}

export default function Chat() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🧩 Cargar historial del chat
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/messages/service/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(res.data);
      } catch (error) {
        console.error("Error al obtener mensajes:", error);
      }
    };
    fetchMessages();
  }, [id, token]);

  // 🔌 Conexión Socket.IO
  useEffect(() => {
    if (!user || !token) return;

    const newSocket = io(import.meta.env.VITE_API_URL || "http://localhost:8080", {
      auth: { token },
    });

    newSocket.emit("userOnline", user.id);
    newSocket.emit("joinRoom", `room_service_${id}`);

    newSocket.on("newMessage", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      toast.success("📩 Nuevo mensaje recibido", { duration: 2000 });
    });

    newSocket.on("updateOnlineUsers", (users: string[]) => {
      setOnlineUsers(users);
    });

    newSocket.on("displayTyping", ({ user: typingUser }) => {
      if (typingUser !== user.id) {
        setPartnerTyping(true);
        setTimeout(() => setPartnerTyping(false), 2000);
      }
    });

    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [id, user, token]);

  // ✍️ Evento de escritura
  const handleTyping = () => {
    if (!socket || isTyping) return;
    setIsTyping(true);
    socket.emit("userTyping", { room: `room_service_${id}`, user: user!.id });
    setTimeout(() => setIsTyping(false), 2000);
  };

  // 📤 Enviar texto
  const sendMessage = () => {
    if (!socket || !input.trim()) return;
    const message = {
      serviceId: id,
      sender: user!.id,
      receiver: "auto",
      content: input.trim(),
    };
    socket.emit("sendMessage", message);
    setMessages((prev) => [...prev, message]);
    setInput("");
  };

  // 📎 Subir archivo o imagen
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const fileUrl = res.data.url;
      const message = {
        serviceId: id,
        sender: user!.id,
        receiver: "auto",
        content: fileUrl,
      };

      socket?.emit("sendMessage", message);
      setMessages((prev) => [...prev, message]);
      toast.success("📎 Archivo enviado");
    } catch (err) {
      console.error("Error al subir archivo:", err);
      toast.error("Error al subir el archivo");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isPartnerOnline = onlineUsers.some((uId) => uId !== user?.id);

  return (
    <div className="flex flex-col h-[80vh] max-w-2xl mx-auto p-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold dark:text-gray-100">
          💬 Chat del Servicio #{id}
        </h2>
        <span
          className={`text-sm font-medium ${
            isPartnerOnline ? "text-green-500" : "text-gray-400"
          }`}
        >
          {isPartnerOnline ? "🟢 En línea" : "⚪ Desconectado"}
        </span>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto space-y-3 p-3 border rounded-lg dark:border-gray-700">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[70%] px-3 py-2 rounded-lg ${
              msg.sender === user?.id
                ? "bg-primary text-white ml-auto"
                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 mr-auto"
            }`}
          >
            {msg.content.match(/\.(jpg|jpeg|png|gif)$/i) ? (
              <img
                src={msg.content}
                alt="archivo"
                className="rounded-lg max-w-[200px] mt-1"
              />
            ) : msg.content.match(/\.(pdf|docx|zip|rar)$/i) ? (
              <a
                href={msg.content}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 underline"
              >
                📎 Descargar archivo
              </a>
            ) : (
              <p className="text-sm">{msg.content}</p>
            )}
          </div>
        ))}
        {partnerTyping && (
          <p className="text-xs italic text-gray-500">✍️ Escribiendo...</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2 items-center">
        <input
          type="file"
          id="fileInput"
          className="hidden"
          accept="image/*,application/pdf,application/zip"
          onChange={handleFileUpload}
        />
        <button
          onClick={() => document.getElementById("fileInput")?.click()}
          className="bg-gray-200 dark:bg-gray-800 px-3 py-2 rounded-lg hover:opacity-80 transition"
          title="Adjuntar archivo"
        >
          📎
        </button>

        <input
          type="text"
          placeholder="Escribe tu mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
            else handleTyping();
          }}
          className="flex-1 px-3 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800 focus:outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
