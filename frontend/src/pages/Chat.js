"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useAuth } from "@/context/authContext";
import { Link } from "react-router-dom";
import axios from "axios";
export default function Chats() {
    const { token, user } = useAuth();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [_socket, setSocket] = useState(null);
    // 📡 Cargar chats del usuario
    useEffect(() => {
        if (!token)
            return;
        const fetchChats = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/services`, { headers: { Authorization: `Bearer ${token}` } });
                setChats(res.data);
            }
            catch (error) {
                console.error("❌ Error al obtener servicios:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchChats();
    }, [token]);
    // 🔌 Conexión WebSocket
    useEffect(() => {
        if (!user || !token)
            return;
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
    if (loading)
        return _jsx("p", { className: "text-center mt-6", children: "Cargando chats..." });
    return (_jsxs("div", { className: "container mx-auto py-8 px-4", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-center", children: "\uD83D\uDCAC Conversaciones Activas" }), chats.length === 0 ? (_jsx("p", { className: "text-center text-gray-500", children: "No tienes conversaciones activas." })) : (_jsx("div", { className: "grid gap-4 md:grid-cols-2", children: chats.map((chat) => (_jsxs(Link, { to: `/chat/${chat._id}`, className: "block p-4 border rounded-xl shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition", children: [_jsx("h4", { className: "font-semibold text-lg", children: chat.title }), _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: [chat.client?.name, " \u2194 ", chat.professional?.name] }), chat.lastMessage && (_jsxs("p", { className: "text-xs italic text-gray-500 mt-1", children: ["\u00DAltimo mensaje: ", chat.lastMessage] })), _jsxs("p", { className: "text-xs text-gray-400 mt-2", children: ["Actualizado: ", new Date(chat.updatedAt).toLocaleString()] })] }, chat._id))) }))] }));
}
