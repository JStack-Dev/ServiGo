import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";

export default function Home() {
  const navigate = useNavigate();
  const { login, loading, error, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔹 Iniciar sesión
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);

      // Esperamos a que el user esté disponible en contexto
      setTimeout(() => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

        if (storedUser.role === "profesional") {
          navigate("/perfil-profesional");
        } else if (storedUser.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/perfil");
        }
      }, 300);
    } catch (err) {
      console.error("❌ Error al iniciar sesión:", err);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-linear-to-br from-blue-600 via-cyan-400 to-green-300">
      {/* 🧱 Card principal */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-[90%] max-w-md text-center"
      >
        {/* 🧩 Logo o título */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">ServiGo</h1>
        <p className="text-gray-700 mb-6">Inicia sesión en tu cuenta</p>

        {/* 🧠 Formulario */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 
                       focus:ring-2 focus:ring-blue-500 outline-none 
                       text-black placeholder-gray-400"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 
                       focus:ring-2 focus:ring-blue-500 outline-none 
                       text-black placeholder-gray-400"
            required
          />

          {/* 🚀 Botón principal */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className={`mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Cargando..." : "Iniciar sesión"}
          </motion.button>

          {error && (
            <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
          )}
        </form>

        {/* 🧭 Enlace a registro */}
        <p className="text-sm text-gray-500 mt-6">
          ¿Aún no tienes cuenta?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Regístrate
          </button>
        </p>
      </motion.div>
    </div>
  );
}
