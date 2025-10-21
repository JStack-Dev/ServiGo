"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./authContext";
import axios from "axios";
import toast from "react-hot-toast";

// 🧩 Tipo de notificación
interface Notification {
  _id?: string;
  id?: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NotificationContextProps {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  // ===============================
  // 📦 Cargar notificaciones desde backend
  // ===============================
  useEffect(() => {
    if (!token) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setNotifications(res.data))
      .catch((err) =>
        console.error("❌ Error al obtener notificaciones:", err)
      );
  }, [token]);

  // ===============================
  // 🔌 Conexión Socket.IO real
  // ===============================
  useEffect(() => {
    if (!user || !token) return;

    const newSocket = io(import.meta.env.VITE_API_URL || "http://localhost:4000", {
      auth: { token },
    });

    newSocket.emit("joinRoom", `room_user_${user.id}`);

    newSocket.on("newNotification", (data: Notification) => {
      setNotifications((prev) => [data, ...prev]);
      toast.success(`${data.title}: ${data.message}`);
    });

    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [user, token]);

  // ===============================
  // 🕒 Recordatorios simulados (solo locales)
  // ===============================
  useEffect(() => {
    if (!user) return;

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
      const simulated: Notification = {
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
  const markAsRead = async (id: string) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id || n.id === id ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error("❌ Error al marcar notificación como leída:", error);
    }
  };

  // ===============================
  // 🔘 Marcar todas como leídas
  // ===============================
  const markAllAsRead = async () => {
    const unreadIds = notifications
      .filter((n) => !n.read)
      .map((n) => n._id || n.id);
    for (const id of unreadIds) await markAsRead(id);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = (): NotificationContextProps => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error(
      "useNotifications debe usarse dentro de un NotificationProvider"
    );
  return context;
};
