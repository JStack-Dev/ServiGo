import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirigir al login tras cerrar sesión
  };

  return (
    <nav className="bg-primary text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="font-bold text-xl">
        ServiGo
      </Link>

      <div className="flex gap-4 items-center">
        <Link to="/services" className="hover:underline">
          Servicios
        </Link>
        <Link to="/contacto" className="hover:underline">
          Contacto
        </Link>

        {user ? (
          <>
            <span className="text-sm italic">👋 {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Iniciar sesión
            </Link>
            <Link to="/register" className="hover:underline">
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
