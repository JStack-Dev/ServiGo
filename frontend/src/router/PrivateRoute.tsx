import { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/authContext";

// ✅ Componente de ruta privada
export default function PrivateRoute(): ReactElement {
  const { token } = useAuth();

  // Si no hay token → redirige al inicio (Home)
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Si hay token → renderiza el contenido protegido
  return <Outlet />;
}
