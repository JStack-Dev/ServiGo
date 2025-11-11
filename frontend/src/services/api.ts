// ==============================
// 🌐 Axios API Config – ServiGo Frontend
// ==============================

import axios from "axios";

// ===============================================
// ⚙️ Detección automática de entorno
// ===============================================
// Si existe VITE_API_URL en .env → la usa
// Si no, detecta si estamos en localhost o en producción
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : "https://servigo-04kk.onrender.com");

// ===============================================
// 🚀 Crear instancia principal de Axios
// ===============================================
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ permite cookies o JWT si es necesario
});

// ===============================================
// 🔐 Interceptor de autenticación JWT
// ===============================================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===============================================
// 🧠 Manejo global opcional de errores (pro tip)
// ===============================================
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       window.location.href = "/"; // Redirigir al login
//     }
//     return Promise.reject(error);
//   }
// );

// ===============================================
// ✅ Exportar la instancia lista para usar
// ===============================================
export default api;

// ===============================================
// 🧩 Cómo se usa (ejemplo):
// import api from "@/services/api";
// const res = await api.get("/api/users/professionals");
// ===============================================
