"use client";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from "react";
import { loginUser, registerUser } from "@/services/auth.service";

// 🧠 Tipos
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>; // ✅ colocado arriba para mayor legibilidad
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// 🟢 Crear contexto
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// 🧩 Provider principal
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 🔁 Cargar usuario almacenado
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user"); // Limpieza por si JSON falla
      }
    }
  }, [token]);

  // 💾 Sincronizar token con localStorage
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  // 🔐 Iniciar sesión
  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginUser(email, password);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("user", JSON.stringify(res.user));
    } catch (err) {
      console.error("❌ Error al iniciar sesión:", err);
      setError("Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  // 🧾 Registrar usuario
  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const res = await registerUser(name, email, password);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("user", JSON.stringify(res.user));
    } catch (err) {
      console.error("❌ Error al registrar usuario:", err);
      setError("Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  // 🚪 Cerrar sesión
  const logout = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // ✅ Proveedor global del contexto
  return (
    <AuthContext.Provider
      value={{ user, setUser, token, loading, error, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 🪝 Hook personalizado para acceder al contexto
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};

// ✅ Export por defecto opcional
export default AuthContext;
