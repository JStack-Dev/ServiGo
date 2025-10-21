"use client";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/authContext";
import { Link } from "react-router-dom";
import axios from "axios";

interface ServiceChat {
  _id: string;
  title: string;
  client: { name: string };
  professional: { name: string };
  lastMessage?: string;
  updatedAt: string;
}

export default function Chats() {
  const { token, user } = useAuth();
  const [chats, setChats] = useState<ServiceChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [_socket, setSocket] = useState<Socket | null>(null);


  // 📡 Cargar chats del usuario
  useEffect(() => {
    if (!token) return;

    const fetchChats = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/services`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setChats(res.data);
      } catch (error) {
        console.error("❌ Error al obtener servicios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [token]);

  // 🔌 Conexión WebSocket
  useEffect(() => {
    if (!user || !token) return;

    const newSocket = io(import.meta.env.VITE_API_URL || "http://localhost:8080", {
      auth: { token },
    });

    // Aquí podrías escuchar mensajes si lo deseas:
    // newSocket.on("message", (msg) => console.log("Nuevo mensaje:", msg));

    setSocket(newSocket);

    // ✅ Cleanup correcto:
    return () => {
      newSocket.disconnect();
    };
  }, [user, token]);

  if (loading) return <p className="text-center mt-6">Cargando chats...</p>;

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">
        💬 Conversaciones Activas
      </h2>

      {chats.length === 0 ? (
        <p className="text-center text-gray-500">
          No tienes conversaciones activas.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {chats.map((chat) => (
            <Link
              key={chat._id}
              to={`/chat/${chat._id}`}
              className="block p-4 border rounded-xl shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <h4 className="font-semibold text-lg">{chat.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {chat.client?.name} ↔ {chat.professional?.name}
              </p>
              {chat.lastMessage && (
                <p className="text-xs italic text-gray-500 mt-1">
                  Último mensaje: {chat.lastMessage}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                Actualizado: {new Date(chat.updatedAt).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
