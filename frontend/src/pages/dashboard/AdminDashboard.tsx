import { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/context/authContext";

interface Metrics {
  totalUsers: number;
  totalServices: number;
  activeTechnicians: number;
  pendingRequests: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.get("/dashboard/metrics");
        setMetrics(res.data);
      } catch (err) {
        console.error("❌ Error al cargar métricas:", err);
        setError("No se pudieron cargar las métricas del sistema.");
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando panel de administrador...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <section className="max-w-6xl mx-auto mt-10 p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Panel del Administrador 🛠️
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Bienvenido, <strong>{user?.name}</strong>. Aquí tienes una visión general del sistema ServiGo.
      </p>

      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 rounded-xl bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 shadow">
            <h3 className="text-sm uppercase font-semibold">Usuarios Totales</h3>
            <p className="text-2xl font-bold">{metrics.totalUsers}</p>
          </div>

          <div className="p-4 rounded-xl bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 shadow">
            <h3 className="text-sm uppercase font-semibold">Servicios Totales</h3>
            <p className="text-2xl font-bold">{metrics.totalServices}</p>
          </div>

          <div className="p-4 rounded-xl bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 shadow">
            <h3 className="text-sm uppercase font-semibold">Técnicos Activos</h3>
            <p className="text-2xl font-bold">{metrics.activeTechnicians}</p>
          </div>

          <div className="p-4 rounded-xl bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 shadow">
            <h3 className="text-sm uppercase font-semibold">Solicitudes Pendientes</h3>
            <p className="text-2xl font-bold">{metrics.pendingRequests}</p>
          </div>
        </div>
      )}

      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
          Próximas mejoras
        </h3>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
          <li>Panel de control de seguridad (alertas antifraude e IA)</li>
          <li>Gestión de usuarios y técnicos desde la interfaz</li>
          <li>Visualización en tiempo real con gráficos (recharts o Chart.js)</li>
        </ul>
      </div>
    </section>
  );
}
