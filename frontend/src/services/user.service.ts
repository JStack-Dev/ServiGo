// ===============================
// 👤 Servicio de Usuarios y Profesionales — ServiGo
// ===============================

import api from "@/api/api";

/* ======================================================
   📦 Tipados
   ====================================================== */
export interface Professional {
  _id: string;
  name: string;
  email: string;
  specialty: string;
  averageRating: number;
  phone?: string;
  isAvailable?: boolean;
}

export interface Category {
  _id: string;
  specialty: string;
}

/* ======================================================
   🧾 Perfil del usuario autenticado
   ====================================================== */
export const getUserProfile = async () => {
  const res = await api.get("/api/users/profile");
  return res.data;
};

export const updateUserProfile = async (data: {
  name?: string;
  email?: string;
  password?: string;
}) => {
  const res = await api.put("/api/users/profile", data);
  return res.data;
};

/* ======================================================
   🧰 Profesionales y categorías
   ====================================================== */

// 🔹 Listar todas las categorías (profesiones únicas)
export const getCategories = async (): Promise<Category[]> => {
  const res = await api.get("/api/users/categories");
  return res.data;
};

// 🔹 Listar profesionales (opcionalmente filtrados por categoría)
export const getProfessionals = async (
  specialty?: string
): Promise<Professional[]> => {
  const query = specialty ? `?specialty=${encodeURIComponent(specialty)}` : "";
  const res = await api.get(`/api/users${query}`);
  return res.data;
};
