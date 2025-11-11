// ================================
// 🧠 Servicio de Autenticación — ServiGo
// ================================

import api from "@/api/api";
import { type User } from "@/context/authContext";

/* ======================================================
   📦 Tipado de la respuesta de autenticación
   ====================================================== */
export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

/* ======================================================
   🔐 Iniciar sesión
   ====================================================== */
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/api/auth/login", {
    email,
    password,
  });

  return res.data;
};

/* ======================================================
   🧾 Registrar nuevo usuario
   ====================================================== */
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: string,
  specialty?: string
): Promise<AuthResponse> => {
  const body: Record<string, string> = { name, email, password, role };

  if (specialty && specialty.trim() !== "") {
    body.specialty = specialty.trim();
  }

  const res = await api.post<AuthResponse>("/api/auth/register", body);
  return res.data;
};
