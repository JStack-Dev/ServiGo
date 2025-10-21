import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/authContext";
// ✅ Componente de ruta privada
export default function PrivateRoute() {
    const { token } = useAuth();
    // Si no hay token → redirige al login
    if (!token) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    // Si hay token → renderiza el contenido protegido
    return _jsx(Outlet, {});
}
