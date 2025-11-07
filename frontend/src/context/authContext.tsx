"use client";

import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  registerUser,
  type AuthResponse,
} from "@/services/auth.service";

/* ===========================================
 🧠 Tipado del usuario según backend ServiGo
=========================================== */
export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: "cliente" | "profesional" | "admin";
  level?: string;
  isActive?: boolean;
  isAvailable?: boolean;
  averageRating?: number;
  completedServices?: number;
  badges?: string[];
  createdAt?: string;
  updatedAt?: string;
  phone?: string;
  profession?: string;
  description?: string;
}

/* ===========================================
 ⚙️ Tipado del contexto de autenticación
=========================================== */
export interface AuthContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: string
  ) => Promise<void>;
  logout: () => void;
}

/* ===========================================
 🟢 Creación del contexto global
=========================================== */
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

/* ===========================================
 🧩 Provider principal
=========================================== */
export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // ✅ FIX — empieza cargando
  const [error, setError] = useState<string | null>(null);

  /* ===========================================
   🔁 Cargar usuario almacenado (inicio app)
  ============================================ */
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      try {
        const parsedUser: User = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsedUser);
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }

    setLoading(false); // ✅ FIX — se marca terminado tras leer localStorage
  }, []);

  /* ===========================================
   💾 Sincronizar token con localStorage
  ============================================ */
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  /* ===========================================
   🔐 Iniciar sesión
  ============================================ */
  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const res: AuthResponse = await loginUser(email, password);

      const normalizedUser: User = {
        ...res.user,
        _id: res.user._id ?? res.user.id ?? "",
        role:
          (res.user.role as "cliente" | "profesional" | "admin") || "cliente",
      };

      setToken(res.token);
      setUser(normalizedUser);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
    } catch (err: unknown) {
      console.error("❌ Error al iniciar sesión:", err);
      const message =
        err instanceof Error
          ? err.message
          : "Credenciales incorrectas o servidor no disponible";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  /* ===========================================
   🧾 Registrar nuevo usuario
  ============================================ */
  const register = async (
    name: string,
    email: string,
    password: string,
    role: string
  ): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const res: AuthResponse = await registerUser(name, email, password, role);

      const normalizedUser: User = {
        ...res.user,
        _id: res.user._id ?? res.user.id ?? "",
        role:
          (res.user.role as "cliente" | "profesional" | "admin") || "cliente",
      };

      setToken(res.token);
      setUser(normalizedUser);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
    } catch (err: unknown) {
      console.error("❌ Error al registrar usuario:", err);
      const message =
        err instanceof Error
          ? err.message
          : "Error al registrarse, revisa los datos e inténtalo nuevamente";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  /* ===========================================
   🚪 Cerrar sesión
  ============================================ */
  const logout = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); // 👈 Redirige al inicio
  };

  /* ===========================================
   🧩 Devolver contexto global
  ============================================ */
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        loading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ===========================================
 🪝 Hook personalizado
=========================================== */
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};

export default AuthContext;
