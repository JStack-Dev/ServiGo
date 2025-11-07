import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// 📦 Tipado de servicio
export interface Servicio {
  _id: string;
  title: string;
  description: string;
  status: "active" | "pending" | "completed";
  price: number;
  date: string;
  professional: {
    name: string;
    phone: string;
    profession: string;
    rating: number;
  };
}

// 🔹 Obtener servicios por estado
export const getServicesByStatus = async (
  status: "active" | "pending" | "completed",
  token: string
): Promise<Servicio[]> => {
  const res = await axios.get(`${API_URL}/services?status=${status}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
