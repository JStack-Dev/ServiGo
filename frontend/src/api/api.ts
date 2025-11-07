import axios, { AxiosInstance } from "axios";

/* ============================================================
   🌍 Instancia base de Axios — API ServiGo
   ============================================================ */

/**
 * Instancia configurada de Axios con URL base y cabeceras comunes.
 * Usada en todos los módulos de API (admin, auth, bookings, etc.)
 */
export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // si tu backend usa cookies / sesiones
});

/* ============================================================
   🧩 Interceptores opcionales
   ============================================================ */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo global de errores HTTP
    if (error.response?.status === 401) {
      console.warn("⚠️ Sesión expirada. Redirigiendo al login...");
      // Opcional: redirigir al login o limpiar token
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);
