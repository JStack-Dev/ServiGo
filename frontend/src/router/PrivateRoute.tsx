import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

/**
 * 🧱 Componente de Ruta Protegida
 * - Verifica si el usuario está autenticado.
 * - Si no hay token → redirige automáticamente al login.
 * - Si hay token → renderiza las rutas hijas (Outlet).
 */
export default function PrivateRoute(): JSX.Element {
  const { user, token } = useAuth();

  // ⛔ Si no hay usuario ni token, redirigir a login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Si hay sesión activa, mostrar la ruta protegida
  return <Outlet />;
}
