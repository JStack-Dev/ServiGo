import { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/authContext";

// ✅ Componente de ruta privada
export default function PrivateRoute(): ReactElement {
  const { token } = useAuth();

  // Si no hay token → redirige al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si hay token → renderiza el contenido protegido
  return <Outlet />;
}
