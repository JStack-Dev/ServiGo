import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/chat";

// 📩 Obtener lista de chats
export const getUserChats = async (token: string) => {
  try {
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("❌ Error al obtener chats:", error);
    return [];
  }
};

// 💬 Obtener mensajes de un servicio
export const getChatMessages = async (serviceId: string, token: string) => {
  try {
    const res = await axios.get(`${API_URL}/${serviceId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("❌ Error al obtener mensajes:", error);
    return [];
  }
};

// 📨 Enviar mensaje
export const sendChatMessage = async (
  serviceId: string,
  content: string,
  receiver: string,
  token: string
) => {
  try {
    const res = await axios.post(
      `${API_URL}/${serviceId}`,
      { content, receiver },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error("❌ Error al enviar mensaje:", error);
  }
};
