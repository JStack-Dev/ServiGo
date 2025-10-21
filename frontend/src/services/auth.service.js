import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/auth";
// 🔹 Login de usuario existente
export async function loginUser(email, password) {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    return res.data;
}
// 🔹 Registro de nuevo usuario
export async function registerUser(name, email, password) {
    const res = await axios.post(`${API_URL}/register`, { name, email, password });
    return res.data;
}
