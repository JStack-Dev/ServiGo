// ============================================
// 💬 Chat API — ServiGo Frontend
// ============================================

import axios, { AxiosError } from "axios";

// 🔗 Normalizamos la URL base
const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "";

// ==============================
// 🧠 Tipos base
// ==============================
interface ChatUser {
  _id: string;
  name: string;
  email?: string;
  role?: string;
}

export interface ChatPreview {
  user: ChatUser;
  serviceId: string;
  lastMessage: string;
  lastDate: string;
  unreadCount?: number;
}

export interface Message {
  _id: string;
  serviceId: string;
  sender: ChatUser;
  receiver: ChatUser;
  content: string;
  read: boolean;
  createdAt: string;
}

// ============================================
// 🧩 Axios personalizado (con interceptores)
// ============================================
const api = axios.create({
  baseURL: `${API_URL}/chats`,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<{ error?: string }>) => {
    console.error("⚠️ API Chat Error:", error.response?.data?.error || error.message);
    return Promise.reject(error);
  }
);

// ============================================
// 📩 Obtener lista de chats del usuario
// ============================================
export const getUserChats = async (token: string): Promise<ChatPreview[]> => {
  const res = await api.get<ChatPreview[]>("/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ============================================
// 💬 Obtener mensajes de un chat (por serviceId)
// ============================================
export const getChatMessages = async (
  serviceId: string,
  token: string
): Promise<Message[]> => {
  const res = await api.get<Message[]>(`/${serviceId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ============================================
// 📨 Enviar mensaje
// ============================================
export const sendChatMessage = async (
  serviceId: string,
  content: string,
  token: string
): Promise<Message> => {
  const res = await api.post<Message>(
    `/${serviceId}`,
    { content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// ============================================
// 🟢 Marcar mensajes como leídos
// ============================================
export const markMessagesAsRead = async (
  serviceId: string,
  token: string
): Promise<void> => {
  await api.patch(`/read/${serviceId}`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
