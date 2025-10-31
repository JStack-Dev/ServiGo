import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/auth";
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

/**
 * 🔹 Iniciar sesión de usuario
 */
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data;
}

/**
 * 🔹 Registrar un nuevo usuario con rol
 */
export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: string
): Promise<AuthResponse> {
  const res = await axios.post(`${API_URL}/register`, { name, email, password, role });
  return res.data;
}
