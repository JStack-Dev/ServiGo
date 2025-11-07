"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/authContext";
import {
  Briefcase,
  Star,
  MapPin,
  Clock,
  Edit,
  Save,
  Power,
  LogOut,
  ClipboardList,
  CheckCircle,
  MessageSquare,
} from "lucide-react";

import JobsActive from "@/components/professional/JobsActive";
import JobsCompleted from "@/components/professional/JobsCompleted";
import OffersIncoming from "@/components/professional/OffersIncoming";

/* =======================================
   🔹 Tipos fuertes para evitar any
======================================= */
interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  profession?: string;
  description?: string;
  isAvailable?: boolean;
  averageRating?: number;
  completedServices?: number;
  level?: string;
}

type TabType = "active" | "completed" | "offers";

/* =======================================
   ⚙️ Componente principal
======================================= */
export default function ProfileProfesional() {
  const { user, setUser, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [available, setAvailable] = useState(user?.isAvailable ?? true);
  const [activeTab, setActiveTab] = useState<TabType>("active");

  const [formData, setFormData] = useState<UserProfile>({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    profession: user?.profession || "",
    description: user?.description || "",
  });

  // 🧩 Si no hay usuario cargado
  if (!user)
    return (
      <div className="flex justify-center items-center h-screen text-white bg-linear-to-br from-blue-600 via-cyan-400 to-green-300">
        <p>Cargando perfil profesional...</p>
      </div>
    );

  // ✏️ Manejo de cambios en los inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 💾 Guardar cambios de perfil
  const handleSave = () => {
    const updatedUser = { ...user, ...formData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setEditing(false);
  };

  // 🔄 Cambiar disponibilidad
  const toggleAvailability = () => {
    const updated = { ...user, isAvailable: !available };
    setAvailable(!available);
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  /* =======================================
     🎨 Render
  ======================================= */
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-600 via-cyan-400 to-green-300 p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-5xl p-8 text-white"
      >
        {/* 🧩 Encabezado */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mb-3">
            <Briefcase size={48} />
          </div>
          <h2 className="text-3xl font-bold">{user.name}</h2>
          <p className="text-sm text-white/80">{user.email}</p>
          <span
            className={`mt-2 px-3 py-1 rounded-full text-sm ${
              available ? "bg-green-500/70" : "bg-red-500/70"
            }`}
          >
            {available ? "Disponible" : "No disponible"}
          </span>
        </div>

        {/* ⭐ Estadísticas */}
        <div className="grid grid-cols-3 gap-4 mb-6 text-center bg-white/20 rounded-xl p-4">
          <div>
            <Star size={20} className="mx-auto mb-1" />
            <p>Valoración</p>
            <span className="font-bold text-lg">{user.averageRating || 4.9}</span>
          </div>
          <div>
            <Clock size={20} className="mx-auto mb-1" />
            <p>Servicios</p>
            <span className="font-bold text-lg">{user.completedServices || 12}</span>
          </div>
          <div>
            <MapPin size={20} className="mx-auto mb-1" />
            <p>Nivel</p>
            <span className="font-bold text-lg">{user.level || "Bronce"}</span>
          </div>
        </div>

        {/* 🧾 Información editable */}
        <div className="space-y-4 mb-8">
          {(Object.keys(formData) as (keyof UserProfile)[])
            .filter((key) => key !== "description")
            .map((field) => (
              <div key={field}>
                <label className="text-sm opacity-80 capitalize">{field}</label>
             <input
  type={field === "email" ? "email" : "text"}
  name={field}
  value={String(formData[field] ?? "")}
  onChange={handleChange}
  disabled={!editing}
  className="w-full mt-1 px-3 py-2 rounded-lg bg-white/20 focus:outline-none"
/>

              </div>
            ))}
          <div>
            <label className="text-sm opacity-80">Descripción</label>
            <textarea
              name="description"
              value={formData.description ?? ""}
              onChange={handleChange}
              disabled={!editing}
              rows={3}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-white/20 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* 🧭 Tabs – trabajos */}
        <div className="flex justify-center gap-4 mb-8">
          {(
            [
              { id: "active", label: "En curso", icon: ClipboardList },
              { id: "completed", label: "Finalizados", icon: CheckCircle },
              { id: "offers", label: "Ofertas", icon: MessageSquare },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-blue-600 font-semibold"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        {/* 📋 Contenido dinámico */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === "active" && <JobsActive />}
          {activeTab === "completed" && <JobsCompleted />}
          {activeTab === "offers" && <OffersIncoming />}
        </motion.div>

        {/* 🔘 Botones de acción */}
        <div className="flex justify-between items-center mt-10">
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
            onClick={toggleAvailability}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md ${
              available
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            <Power size={18} />
            {available ? "Desactivar" : "Activar"}
          </motion.button>
        </div>

        {/* 🚪 Logout */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="mt-6 flex items-center gap-2 justify-center bg-gray-800 hover:bg-gray-900 w-full py-2 rounded-lg shadow-md"
        >
          <LogOut size={18} />
          Cerrar sesión
        </motion.button>
      </motion.div>
    </div>
  );
}
