"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/authContext";
import { Link } from "react-router-dom";
import { io, Socket } from "socket.io-client";

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

  // 🧩 Cargar servicios (chats base)
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get<ServiceChat[]>(
          `${import.meta.env.VITE_API_URL}/services`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setChats(res.data);
      } catch (error) {
        console.error("Error al obtener servicios:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [token]);

  // 🔌 Conexión Socket.IO para mensajes en tiempo real
  useEffect(() => {
    if (!user || !token) return;

    // ✅ Definimos el socket con tipo explícito
    const newSocket: Socket = io(import.meta.env.VITE_API_URL || "http://localhost:8080", {
      auth: { token },
    });

    newSocket.emit("userOnline", user.id);

    // 📨 Escuchar nuevos mensajes en tiempo real
    newSocket.on("newMessage", (msg: { serviceId: string; content: string }) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === msg.serviceId
            ? { ...chat, lastMessage: msg.content, updatedAt: new Date().toISOString() }
            : chat
        )
      );
    });

    setSocket(newSocket);

    // ✅ Cleanup correcto: solo desconectamos, no devolvemos el socket
    return () => {
      newSocket.disconnect();
    };
  }, [user, token]);

  // 🔁 Estado de carga
  if (loading)
    return (
      <p className="text-center mt-6 text-gray-500 dark:text-gray-400">
        Cargando chats...
      </p>
    );

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
        💬 Conversaciones Activas
      </h2>

      {chats.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No tienes conversaciones activas.
        </p>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 rounded-xl shadow-sm bg-white dark:bg-gray-900">
          {chats.map((chat) => (
            <li key={chat._id}>
              <Link
                to={`/chat/${chat._id}`}
                className="flex justify-between items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition rounded-xl"
              >
                <div className="flex flex-col">
                  <h4 className="font-semibold text-lg dark:text-gray-100">
                    {chat.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {chat.client?.name} ↔ {chat.professional?.name}
                  </p>

                  {chat.lastMessage ? (
                    <p className="text-xs italic text-gray-500 dark:text-gray-400 mt-1 truncate max-w-[250px]">
                      Último mensaje: {chat.lastMessage}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400 mt-1">Sin mensajes aún</p>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-400">
                    {new Date(chat.updatedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
