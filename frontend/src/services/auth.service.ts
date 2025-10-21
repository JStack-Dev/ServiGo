import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/auth";

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

// 🔹 Login de usuario existente
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data;
}

// 🔹 Registro de nuevo usuario
export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await axios.post(`${API_URL}/register`, { name, email, password });
  return res.data;
}
