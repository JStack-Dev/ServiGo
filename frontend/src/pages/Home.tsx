import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, User } from "lucide-react";

export default function Home() {
  const [role, setRole] = useState<"particular" | "profesional" | null>(null);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-cyan-400 to-green-300">
      {/* 🧱 Card principal */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-[90%] max-w-md text-center"
      >
        {/* 🧩 Logo o título */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">ServiGo</h1>
        <p className="text-gray-500 mb-6">
          Regístrate para comenzar
        </p>

        {/* 🧠 Formulario */}
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nombre completo"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* 🎯 Selector de rol */}
          <div className="flex justify-around mt-4">
            <motion.button
              type="button"
              onClick={() => setRole("particular")}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl border ${
                role === "particular"
                  ? "bg-blue-100 border-blue-600 text-blue-700"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <User size={28} />
              <span className="text-sm font-medium">Particular</span>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => setRole("profesional")}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl border ${
                role === "profesional"
                  ? "bg-green-100 border-green-600 text-green-700"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Briefcase size={28} />
              <span className="text-sm font-medium">Profesional</span>
            </motion.button>
          </div>

          {/* 🚀 Botón de registro */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition-all"
          >
            Registrarme
          </motion.button>
        </form>

        {/* 🧭 Enlace secundario */}
        <p className="text-sm text-gray-500 mt-4">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-blue-600 font-semibold hover:underline">
            Inicia sesión
          </a>
        </p>
      </motion.div>
    </div>
  );
}
