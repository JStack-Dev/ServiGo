"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useEffect, useContext, } from "react";
import { loginUser, registerUser } from "@/services/auth.service";
// 🟢 Crear contexto
const AuthContext = createContext(undefined);
// 🧩 Provider principal
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // 🔁 Cargar usuario almacenado
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            }
            catch {
                localStorage.removeItem("user"); // Limpieza por si JSON falla
            }
        }
    }, [token]);
    // 💾 Sincronizar token con localStorage
    useEffect(() => {
        if (token)
            localStorage.setItem("token", token);
        else
            localStorage.removeItem("token");
    }, [token]);
    // 🔐 Iniciar sesión
    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const res = await loginUser(email, password);
            setToken(res.token);
            setUser(res.user);
            localStorage.setItem("user", JSON.stringify(res.user));
        }
        catch (err) {
            console.error("❌ Error al iniciar sesión:", err);
            setError("Credenciales incorrectas");
        }
        finally {
            setLoading(false);
        }
    };
    // 🧾 Registrar usuario
    const register = async (name, email, password) => {
        setLoading(true);
        setError(null);
        try {
            const res = await registerUser(name, email, password);
            setToken(res.token);
            setUser(res.user);
            localStorage.setItem("user", JSON.stringify(res.user));
        }
        catch (err) {
            console.error("❌ Error al registrar usuario:", err);
            setError("Error al registrarse");
        }
        finally {
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
    // ✅ Proveedor global del contexto
    return (_jsx(AuthContext.Provider, { value: { user, setUser, token, loading, error, login, register, logout }, children: children }));
}
// 🪝 Hook personalizado para acceder al contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    return context;
};
// ✅ Export por defecto opcional
export default AuthContext;
