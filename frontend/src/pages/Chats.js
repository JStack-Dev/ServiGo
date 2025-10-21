"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/authContext";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
export default function Chats() {
    const { token, user } = useAuth();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [_socket, setSocket] = useState(null);
    // 🧩 Cargar servicios (chats base)
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/services`, { headers: { Authorization: `Bearer ${token}` } });
                setChats(res.data);
            }
            catch (error) {
                console.error("Error al obtener servicios:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchChats();
    }, [token]);
    // 🔌 Conexión Socket.IO para mensajes en tiempo real
    useEffect(() => {
        if (!user || !token)
            return;
        // ✅ Definimos el socket con tipo explícito
        const newSocket = io(import.meta.env.VITE_API_URL || "http://localhost:8080", {
            auth: { token },
        });
        newSocket.emit("userOnline", user.id);
        // 📨 Escuchar nuevos mensajes en tiempo real
        newSocket.on("newMessage", (msg) => {
            setChats((prevChats) => prevChats.map((chat) => chat._id === msg.serviceId
                ? { ...chat, lastMessage: msg.content, updatedAt: new Date().toISOString() }
                : chat));
        });
        setSocket(newSocket);
        // ✅ Cleanup correcto: solo desconectamos, no devolvemos el socket
        return () => {
            newSocket.disconnect();
        };
    }, [user, token]);
    // 🔁 Estado de carga
    if (loading)
        return (_jsx("p", { className: "text-center mt-6 text-gray-500 dark:text-gray-400", children: "Cargando chats..." }));
    return (_jsxs("div", { className: "container mx-auto py-8 px-4", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-center dark:text-white", children: "\uD83D\uDCAC Conversaciones Activas" }), chats.length === 0 ? (_jsx("p", { className: "text-center text-gray-500 dark:text-gray-400", children: "No tienes conversaciones activas." })) : (_jsx("ul", { className: "divide-y divide-gray-200 dark:divide-gray-700 rounded-xl shadow-sm bg-white dark:bg-gray-900", children: chats.map((chat) => (_jsx("li", { children: _jsxs(Link, { to: `/chat/${chat._id}`, className: "flex justify-between items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition rounded-xl", children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("h4", { className: "font-semibold text-lg dark:text-gray-100", children: chat.title }), _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: [chat.client?.name, " \u2194 ", chat.professional?.name] }), chat.lastMessage ? (_jsxs("p", { className: "text-xs italic text-gray-500 dark:text-gray-400 mt-1 truncate max-w-[250px]", children: ["\u00DAltimo mensaje: ", chat.lastMessage] })) : (_jsx("p", { className: "text-xs text-gray-400 mt-1", children: "Sin mensajes a\u00FAn" }))] }), _jsx("div", { className: "text-right", children: _jsx("p", { className: "text-xs text-gray-400", children: new Date(chat.updatedAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }) }) })] }) }, chat._id))) }))] }));
}
