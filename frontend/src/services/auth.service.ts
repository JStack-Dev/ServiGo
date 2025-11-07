import axios from "axios";

/**
 * 🌍 URL base del backend
 * Asegúrate de tener en tu .env:
 * VITE_API_URL=http://localhost:4000/api
 */
const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "http://localhost:4000/api";

/* ============================================
   🧠 Tipado de respuesta del backend
============================================ */
export interface AuthResponse {
  token: string;
  user: {
    _id?: string;
    id?: string;
    name: string;
    email: string;
    role: "cliente" | "profesional" | "admin";
  };
}

/* ============================================
   🔐 Iniciar sesión
============================================ */
export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  // ✅ Usa la ruta correcta: /auth/login
  const res = await axios.post(`${API_URL}/auth/login`, { email, password });
  return res.data;
}

/* ============================================
   🧾 Registrar usuario
============================================ */
export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: string
): Promise<AuthResponse> {
  // ✅ Usa la ruta correcta: /auth/register
  const res = await axios.post(`${API_URL}/auth/register`, {
    name,
    email,
    password,
    role,
  });
  return res.data;
}
