"use client";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from "react";
import { loginUser, registerUser } from "@/services/auth.service";

// 🧠 Tipos de usuario y contexto
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthContextProps {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// 🟢 Crear el contexto global
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// 🧩 Provider principal de autenticación
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔁 Cargar usuario guardado
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, [token]);

  // 💾 Guardar o eliminar token según sesión
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // 🔐 Iniciar sesión
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginUser(email, password);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("user", JSON.stringify(res.user));
    } catch (err) {
      setError("Credenciales incorrectas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🧾 Registrar usuario
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await registerUser(name, email, password);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("user", JSON.stringify(res.user));
    } catch (err) {
      setError("Error al registrarse");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🚪 Cerrar sesión
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, error, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 🪝 Hook personalizado
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

// ✅ Export por defecto (opcional, para compatibilidad)
export default AuthContext;
