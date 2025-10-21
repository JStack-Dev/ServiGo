import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import { useNavigate } from "react-router-dom";
export default function NotificationBell() {
    const { notifications, unreadCount, markAsRead } = useNotifications();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    // 🧭 Redirección según tipo de notificación (personalizable)
    const handleNotificationClick = (n) => {
        markAsRead(n.id);
        setOpen(false); // Cerrar el menú al hacer clic
        navigate("/dashboard"); // Puedes cambiar la ruta según el tipo
    };
    return (_jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setOpen(!open), className: "relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition", children: [_jsx(Bell, { className: "w-6 h-6 text-gray-700 dark:text-gray-200" }), unreadCount > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5", children: unreadCount }))] }), open && (_jsxs("div", { className: "absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50", children: [_jsx("div", { className: "p-3 border-b border-gray-100 dark:border-gray-800", children: _jsx("h4", { className: "text-sm font-semibold text-gray-800 dark:text-gray-200", children: "Notificaciones" }) }), _jsx("div", { className: "max-h-60 overflow-y-auto", children: notifications.length === 0 ? (_jsx("p", { className: "p-4 text-sm text-gray-500 dark:text-gray-400 text-center", children: "No tienes notificaciones nuevas." })) : (notifications.map((n) => (_jsxs("div", { onClick: () => handleNotificationClick(n), className: `p-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition ${n.read ? "opacity-70" : ""}`, children: [_jsx("p", { className: "text-sm font-semibold text-gray-800 dark:text-gray-100", children: n.title }), _jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: n.message }), _jsx("span", { className: "block text-xs text-gray-400 mt-1", children: new Date(n.createdAt).toLocaleTimeString() })] }, n.id)))) })] }))] }));
}
