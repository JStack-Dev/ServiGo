import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import NotificationBell from "@/components/NotificationBell";
import { useAuth } from "@/context/authContext";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <nav className="bg-primary text-white shadow-card dark:bg-neutral-dark dark:text-neutral-light transition-colors duration-300">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* 🔹 Logo / Branding */}
        <Link
          to="/"
          className="font-display text-2xl font-semibold tracking-tight"
        >
          ServiGo
        </Link>

        {/* 🔹 Navegación principal */}
        <ul className="flex gap-6 items-center">
          <li>
            <Link to="/" className="hover:text-secondary transition">
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/servicios" className="hover:text-secondary transition">
              Servicios
            </Link>
          </li>
          <li>
            <Link to="/contacto" className="hover:text-secondary transition">
              Contacto
            </Link>
          </li>

          {/* 🔹 Campana de notificaciones */}
          {user && (
            <li>
              <NotificationBell />
            </li>
          )}

          {/* 🔹 Botón de tema claro/oscuro */}
          <li>
            <button
              onClick={toggleTheme}
              className="ml-4 text-lg bg-secondary px-3 py-1 rounded-full text-neutral-dark hover:opacity-80 transition"
              title="Cambiar tema"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </li>

          {/* 🔹 Estado de sesión */}
          {user ? (
            <>
              <li className="text-sm font-semibold">
                Hola, {user.name.split(" ")[0]} 👋
              </li>
              <li>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold transition"
                >
                  Cerrar sesión
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="bg-secondary text-neutral-dark px-3 py-1 rounded-full font-semibold hover:opacity-80 transition"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="border border-secondary px-3 py-1 rounded-full font-semibold hover:bg-secondary hover:text-neutral-dark transition"
                >
                  Registro
                </Link>
              </li>
              <li>
               <Link to="/notificaciones" className="hover:text-secondary transition">
                 Historial
               </Link>
             </li>
             <li>
               <Link to="/chat" className="hover:text-secondary transition">
                Chat
               </Link>
             </li>


            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
