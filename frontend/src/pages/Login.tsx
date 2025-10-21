import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-light dark:bg-neutral-dark transition-colors">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-card p-8 rounded-2xl w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-primary dark:text-secondary">
          Iniciar sesión
        </h2>

        {error && (
          <div className="text-red-500 text-center text-sm mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-blue-700"
          }`}
        >
          {loading ? "Cargando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
};

export default Login;
