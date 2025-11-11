"use client";

import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { motion } from "framer-motion";
import { Briefcase, User } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    specialty: "", // ✅ nuevo campo profesión
  });

  // 🧠 Manejar cambios de inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🚀 Enviar formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("❌ Las contraseñas no coinciden");
      return;
    }

    if (!form.role) {
      alert("⚠️ Selecciona si eres Particular o Profesional");
      return;
    }

    if (form.role === "profesional" && !form.specialty.trim()) {
      alert("⚠️ Debes indicar tu profesión");
      return;
    }

    try {
      await register(
        form.name,
        form.email,
        form.password,
        form.role,
        form.specialty
      );
    } catch (err) {
      console.error("❌ Error en el registro:", err);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-cyan-400 to-green-300">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-[90%] max-w-md text-center"
      >
        {/* 🧩 Título */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">ServiGo</h1>
        <p className="text-gray-700 mb-6">Crea tu cuenta para comenzar</p>

        {/* 🧠 Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre completo"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 
                       focus:ring-2 focus:ring-blue-500 outline-none 
                       text-black placeholder-gray-400"
            required
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Correo electrónico"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 
                       focus:ring-2 focus:ring-blue-500 outline-none 
                       text-black placeholder-gray-400"
            required
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Contraseña"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 
                       focus:ring-2 focus:ring-blue-500 outline-none 
                       text-black placeholder-gray-400"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirmar contraseña"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 
                       focus:ring-2 focus:ring-blue-500 outline-none 
                       text-black placeholder-gray-400"
            required
          />

          {/* 🎯 Selector de rol */}
          <div className="flex justify-around mt-4">
            {/* 👤 Particular → cliente */}
            <motion.button
              type="button"
              onClick={() => setForm({ ...form, role: "cliente" })}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                form.role === "cliente"
                  ? "bg-blue-100 border-blue-600 text-blue-700"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <User size={28} />
              <span className="text-sm font-medium">Particular</span>
            </motion.button>

            {/* 🧰 Profesional */}
            <motion.button
              type="button"
              onClick={() => setForm({ ...form, role: "profesional" })}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                form.role === "profesional"
                  ? "bg-green-100 border-green-600 text-green-700"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Briefcase size={28} />
              <span className="text-sm font-medium">Profesional</span>
            </motion.button>
          </div>

          {/* 🧰 Campo visible solo si el rol es profesional */}
          {form.role === "profesional" && (
            <motion.input
              type="text"
              name="specialty"
              value={form.specialty}
              onChange={handleChange}
              placeholder="¿Cuál es tu profesión? (Ej: Electricista, Fontanero...)"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 
                         focus:ring-2 focus:ring-green-500 outline-none 
                         text-black placeholder-gray-400"
              required
            />
          )}

          {/* 🚨 Mensaje de error */}
          {error && (
            <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
          )}

          {/* 🚀 Botón principal */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className={`mt-6 w-full py-2 rounded-lg text-white font-semibold shadow-md transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Creando cuenta..." : "Registrarse"}
          </motion.button>
        </form>

        {/* 🔁 Enlace inverso */}
        <p className="text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta?{" "}
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Inicia sesión
          </button>
        </p>
      </motion.div>
    </div>
  );
}
