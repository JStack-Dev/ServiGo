// ===============================
// 💼 Servicio de Servicios (Bookings) — ServiGo
// ===============================

import api from "@/api/api";

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
  status: "active" | "pending" | "completed"
): Promise<Servicio[]> => {
  const res = await api.get(`/api/services?status=${status}`);
  return res.data;
};
