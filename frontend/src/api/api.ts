// ==============================
// 🌐 Axios Global Config – ServiGo Frontend
// ==============================

import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

/* ============================================================
   🌍 URL base dinámica (segura y sin duplicar /api)
   ============================================================ */
const isLocalhost = window.location.hostname === "localhost";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (isLocalhost
    ? "http://localhost:4000"
    : "https://servigo-04kk.onrender.com");

/* ============================================================
   🚀 Instancia global de Axios
   ============================================================ */
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/* ============================================================
   🔐 Interceptor de solicitudes (JWT)
   ============================================================ */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/* ============================================================
   ⚠️ Interceptor de respuestas (manejo global)
   ============================================================ */
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 400:
          console.warn("⚠️ Solicitud incorrecta (400)");
          break;
        case 401:
          console.warn("🔐 Sesión expirada o token inválido");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/";
          break;
        case 404:
          console.warn("❌ Recurso no encontrado (404)");
          break;
        case 500:
          console.error("💥 Error interno del servidor (500)");
          break;
        default:
          console.error(`⚠️ Error HTTP ${status}`);
      }
    } else {
      console.error("🚫 Error de red o servidor inalcanzable:", error.message);
    }

    return Promise.reject(error);
  }
);

/* ============================================================
   ✅ Exportar lista para usar en toda la app
   ============================================================ */
export default api;

/*
🧩 Ejemplo de uso:
import api from "@/api/api";

const res = await api.get("/api/users?specialty=Electricista");
console.log(res.data);
*/
