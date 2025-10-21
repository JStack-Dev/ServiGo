"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { useNotifications } from "@/context/NotificationContext";
import axios from "axios";
export default function Notificaciones() {
    const { token } = useAuth();
    const { markAsRead } = useNotifications();
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState("all");
    useEffect(() => {
        if (!token)
            return;
        const fetchNotifications = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/notifications`, { headers: { Authorization: `Bearer ${token}` } });
                setNotifications(res.data);
            }
            catch (error) {
                console.error("Error al obtener notificaciones:", error);
            }
        };
        fetchNotifications();
    }, [token]);
    const handleMarkAsRead = async (id) => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/notifications/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } });
            markAsRead(id);
            setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
        }
        catch (error) {
            console.error("Error al marcar como leída:", error);
        }
    };
    const filteredNotifications = filter === "all"
        ? notifications
        : notifications.filter((n) => filter === "unread" ? !n.read : n.type === filter);
    return (_jsxs("div", { className: "container mx-auto py-8 px-4 text-gray-800 dark:text-gray-100", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "Historial de Notificaciones" }), _jsxs("div", { className: "flex gap-4 mb-6", children: [_jsx("button", { onClick: () => setFilter("all"), className: `px-4 py-2 rounded-lg ${filter === "all"
                            ? "bg-primary text-white"
                            : "bg-gray-200 dark:bg-gray-800"}`, children: "Todas" }), _jsx("button", { onClick: () => setFilter("unread"), className: `px-4 py-2 rounded-lg ${filter === "unread"
                            ? "bg-primary text-white"
                            : "bg-gray-200 dark:bg-gray-800"}`, children: "No le\u00EDdas" }), _jsx("button", { onClick: () => setFilter("service"), className: `px-4 py-2 rounded-lg ${filter === "service"
                            ? "bg-primary text-white"
                            : "bg-gray-200 dark:bg-gray-800"}`, children: "Servicios" }), _jsx("button", { onClick: () => setFilter("review"), className: `px-4 py-2 rounded-lg ${filter === "review"
                            ? "bg-primary text-white"
                            : "bg-gray-200 dark:bg-gray-800"}`, children: "Rese\u00F1as" })] }), _jsx("div", { className: "space-y-4", children: filteredNotifications.length === 0 ? (_jsx("p", { className: "text-gray-500", children: "No hay notificaciones para mostrar." })) : (filteredNotifications.map((n) => (_jsx("div", { className: `p-4 border rounded-xl shadow-sm ${n.read
                        ? "bg-gray-100 dark:bg-gray-800 opacity-70"
                        : "bg-white dark:bg-gray-900"}`, children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-semibold", children: n.title }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: n.message }), _jsx("p", { className: "text-xs text-gray-400 mt-1", children: new Date(n.createdAt).toLocaleString() })] }), !n.read && (_jsx("button", { onClick: () => handleMarkAsRead(n.id), className: "text-sm bg-primary text-white px-2 py-1 rounded hover:opacity-80 transition", children: "Marcar le\u00EDda" }))] }) }, n.id)))) })] }));
}
