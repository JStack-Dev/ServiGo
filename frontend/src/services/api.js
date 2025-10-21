// ==============================
// 🌐 Axios API Config – ServiGo Frontend
// ==============================
import axios from "axios";
// ✅ URL base del backend
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
// 🚀 Crear instancia de Axios
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // ✅ permite cookies si usas auth JWT
});
// 🧩 Interceptor opcional de autenticación
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
// ✅ Exportar la instancia para usarla globalmente
export default api;
