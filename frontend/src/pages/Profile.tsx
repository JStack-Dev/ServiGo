"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { User, Star, LogOut, Edit, Save, Moon, Sun, LayoutDashboard } from "lucide-react";

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen text-white bg-linear-to-br
 from-blue-600 via-cyan-400 to-green-300">
        <p>Cargando tu perfil...</p>
      </div>
    );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setUser({ ...user, ...formData });
    localStorage.setItem("user", JSON.stringify({ ...user, ...formData }));
    setEditing(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br
 from-blue-600 via-cyan-400 to-green-300 p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-lg p-8 text-white"
      >
        {/* 🧩 Encabezado */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mb-3">
            <User size={48} />
          </div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-sm text-white/80">{user.email}</p>
          <p className="mt-1 bg-white/20 px-3 py-1 rounded-full text-sm capitalize">
            {user.role}
          </p>
        </div>

        {/* ⭐ Stats (solo para profesional) */}
        {user.role === "profesional" && (
          <div className="bg-white/20 rounded-lg p-4 mb-6 text-sm flex justify-around">
            <div className="flex flex-col items-center">
              <Star size={20} />
              <p>Valoración</p>
              <span className="font-bold text-lg">4.8</span>
            </div>
            <div className="flex flex-col items-center">
              <p>Servicios</p>
              <span className="font-bold text-lg">27</span>
            </div>
            <div className="flex flex-col items-center">
              <p>Nivel</p>
              <span className="font-bold text-lg">{user.level || "Bronce"}</span>
            </div>
          </div>
        )}

        {/* 🧾 Formulario */}
        <div className="space-y-4">
          <div>
            <label className="text-sm opacity-80">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!editing}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-white/20 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm opacity-80">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!editing}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-white/20 focus:outline-none"
            />
          </div>
        </div>

        {/* 🔘 Botones principales */}
        <div className="flex justify-between items-center mt-8">
          {!editing ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
            >
              <Edit size={18} />
              Editar
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg shadow-md"
            >
              <Save size={18} />
              Guardar
            </motion.button>
          )}

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg shadow-md"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {darkMode ? "Modo claro" : "Modo oscuro"}
          </motion.button>
        </div>

        {/* 🧭 Botón para ir al Dashboard */}
        {user.role === "cliente" && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/dashboard")}
            className="mt-6 flex items-center gap-2 justify-center bg-linear-to-br
 from-blue-600 via-cyan-400 to-green-300 hover:opacity-90 w-full py-2 rounded-lg shadow-md text-white font-semibold"
          >
            <LayoutDashboard size={18} />
            Ir a mi Panel de Servicios
          </motion.button>
        )}

        {/* 🚪 Logout */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="mt-4 flex items-center gap-2 justify-center bg-red-600 hover:bg-red-700 w-full py-2 rounded-lg shadow-md"
        >
          <LogOut size={18} />
          Cerrar sesión
        </motion.button>
      </motion.div>
    </div>
  );
}
