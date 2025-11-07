import axios from "axios";

/* ============================================================
   📡 API Admin — Servicios
   ============================================================ */

// 🧩 Obtener todos los servicios
export const getAllServices = async () => {
  return axios.get(`${import.meta.env.VITE_API_URL}/admin/services`);
};

// 🗑️ Eliminar un servicio por ID
export const deleteService = async (id: string) => {
  return axios.delete(`${import.meta.env.VITE_API_URL}/admin/services/${id}`);
};

// 🧠 (Opcional) — Obtener logs del sistema (para LogsViewer)
export const getSystemLogs = async () => {
  return axios.get(`${import.meta.env.VITE_API_URL}/admin/logs`);
};
