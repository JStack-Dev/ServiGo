import { useState } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import { useNavigate } from "react-router-dom";

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // 🧭 Redirección según tipo de notificación (personalizable)
  const handleNotificationClick = (n: any) => {
    markAsRead(n.id);
    setOpen(false); // Cerrar el menú al hacer clic
    navigate("/dashboard"); // Puedes cambiar la ruta según el tipo
  };

  return (
    <div className="relative">
      {/* 🔔 Icono de campana */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        <Bell className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 📬 Menú desplegable */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-100 dark:border-gray-800">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Notificaciones
            </h4>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                No tienes notificaciones nuevas.
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition ${
                    n.read ? "opacity-70" : ""
                  }`}
                >
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {n.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {n.message}
                  </p>
                  <span className="block text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
