import { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { Loader2 } from "lucide-react";

/* ======================================================
   🔐 PrivateRoute — Protección con validación segura
====================================================== */
export default function PrivateRoute(): ReactElement {
  const { token, loading } = useAuth();

  // ⏳ Mientras el contexto se inicializa, evita parpadeos o redirecciones erróneas
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-600 via-cyan-400 to-green-300 text-white">
        <Loader2 className="animate-spin w-8 h-8" />
        <span className="ml-3 text-lg font-medium">Validando sesión...</span>
      </div>
    );
  }

  // 🚫 Si no hay token (usuario no autenticado)
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Usuario autenticado → renderiza la ruta protegida
  return <Outlet />;
}
