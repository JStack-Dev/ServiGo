"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState, } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./authContext";
import axios from "axios";
import toast from "react-hot-toast";
// 🌐 Crear el contexto
const NotificationContext = createContext(undefined);
export function NotificationProvider({ children }) {
    const { user, token } = useAuth();
    const [notifications, setNotifications] = useState([]);
    // ===============================
    // 📦 Cargar notificaciones desde backend
    // ===============================
    useEffect(() => {
        if (!token)
            return;
        const fetchNotifications = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/notifications`, { headers: { Authorization: `Bearer ${token}` } });
                setNotifications(res.data);
            }
            catch (err) {
                console.error("❌ Error al obtener notificaciones:", err);
            }
        };
        fetchNotifications();
    }, [token]);
    // ===============================
    // 🔌 Conexión Socket.IO (sin estado)
    // ===============================
    useEffect(() => {
        if (!user || !token)
            return;
        const socket = io(import.meta.env.VITE_API_URL || "http://localhost:4000", {
            auth: { token },
        });
        socket.emit("joinRoom", `room_user_${user.id}`);
        socket.on("newNotification", (data) => {
            setNotifications((prev) => [data, ...prev]);
            toast.success(`${data.title}: ${data.message}`);
        });
        return () => {
            socket.disconnect();
        };
    }, [user, token]);
    // ===============================
    // 🕒 Recordatorios simulados (solo locales)
    // ===============================
    useEffect(() => {
        if (!user)
            return;
        const reminders = [
            {
                title: "Recordatorio de servicio",
                message: "Tienes un servicio pendiente de completar.",
            },
            {
                title: "Revisión pendiente",
                message: "No olvides dejar tu reseña del último servicio.",
            },
            {
                title: "Mensaje sin leer",
                message: "Tienes mensajes nuevos en tu bandeja.",
            },
            {
                title: "Consejo del día 💡",
                message: "Mantén tu perfil actualizado para recibir más solicitudes.",
            },
        ];
        const interval = setInterval(() => {
            const random = reminders[Math.floor(Math.random() * reminders.length)];
            const simulated = {
                id: Date.now().toString(),
                title: random.title,
                message: random.message,
                read: false,
                createdAt: new Date().toISOString(),
            };
            setNotifications((prev) => [simulated, ...prev]);
            toast(`${random.title}: ${random.message}`, {
                icon: "🕒",
                duration: 4000,
            });
        }, 60000); // ⏱ cada 60 segundos
        return () => clearInterval(interval);
    }, [user]);
    // ===============================
    // 📩 Marcar una notificación como leída
    // ===============================
    const markAsRead = async (id) => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/notifications/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } });
            setNotifications((prev) => prev.map((n) => n._id === id || n.id === id ? { ...n, read: true } : n));
        }
        catch (error) {
            console.error("❌ Error al marcar notificación como leída:", error);
        }
    };
    // ===============================
    // 🔘 Marcar todas como leídas
    // ===============================
    const markAllAsRead = async () => {
        const unreadIds = notifications
            .filter((n) => !n.read)
            .map((n) => n._id || n.id)
            .filter(Boolean);
        for (const id of unreadIds) {
            await markAsRead(id);
        }
    };
    const unreadCount = notifications.filter((n) => !n.read).length;
    return (_jsx(NotificationContext.Provider, { value: { notifications, unreadCount, markAsRead, markAllAsRead }, children: children }));
}
// ===============================
// 🧩 Hook personalizado
// ===============================
export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications debe usarse dentro de un NotificationProvider");
    }
    return context;
};
