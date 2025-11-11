// ================================
// 🧠 Servicio de Autenticación — ServiGo
// ================================

import { type User } from "@/context/authContext";

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

/* ===========================================
 🔐 Iniciar sesión
=========================================== */
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error al iniciar sesión");
  }

  return res.json();
};

/* ===========================================
 🧾 Registrar nuevo usuario
=========================================== */
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: string,
  specialty?: string
): Promise<AuthResponse> => {
  // ✅ Construimos el body dinámicamente
  const body: Record<string, string> = {
    name,
    email,
    password,
    role,
  };

  // Solo enviamos specialty si existe y no está vacío
  if (specialty && specialty.trim() !== "") {
    body.specialty = specialty.trim();
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error al registrarse");
  }

  return res.json();
};
