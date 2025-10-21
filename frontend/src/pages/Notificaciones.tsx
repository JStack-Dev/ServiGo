"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { useNotifications } from "@/context/NotificationContext";
import axios from "axios";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: string;
}

export default function Notificaciones() {
  const { token } = useAuth();
  const { markAsRead } = useNotifications();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!token) return;
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/notifications`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotifications(res.data);
      } catch (error) {
        console.error("Error al obtener notificaciones:", error);
      }
    };
    fetchNotifications();
  }, [token]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error al marcar como leída:", error);
    }
  };

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((n) =>
          filter === "unread" ? !n.read : n.type === filter
        );

  return (
    <div className="container mx-auto py-8 px-4 text-gray-800 dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-6">Historial de Notificaciones</h2>

      {/* Filtros */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg ${
            filter === "all"
              ? "bg-primary text-white"
              : "bg-gray-200 dark:bg-gray-800"
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 rounded-lg ${
            filter === "unread"
              ? "bg-primary text-white"
              : "bg-gray-200 dark:bg-gray-800"
          }`}
        >
          No leídas
        </button>
        <button
          onClick={() => setFilter("service")}
          className={`px-4 py-2 rounded-lg ${
            filter === "service"
              ? "bg-primary text-white"
              : "bg-gray-200 dark:bg-gray-800"
          }`}
        >
          Servicios
        </button>
        <button
          onClick={() => setFilter("review")}
          className={`px-4 py-2 rounded-lg ${
            filter === "review"
              ? "bg-primary text-white"
              : "bg-gray-200 dark:bg-gray-800"
          }`}
        >
          Reseñas
        </button>
      </div>

      {/* Listado */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <p className="text-gray-500">No hay notificaciones para mostrar.</p>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 border rounded-xl shadow-sm ${
                n.read
                  ? "bg-gray-100 dark:bg-gray-800 opacity-70"
                  : "bg-white dark:bg-gray-900"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{n.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {n.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
                {!n.read && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="text-sm bg-primary text-white px-2 py-1 rounded hover:opacity-80 transition"
                  >
                    Marcar leída
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
