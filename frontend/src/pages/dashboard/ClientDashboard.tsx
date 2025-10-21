import { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/context/authContext";

interface Service {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function ClientDashboard() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/services/mine");
        setServices(res.data.services);
      } catch (err) {
        console.error("❌ Error al cargar servicios:", err);
        setError("No se pudieron cargar tus servicios.");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando tus servicios...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <section className="max-w-5xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Bienvenido, {user?.name} 👋
      </h2>
      <h3 className="text-lg text-gray-600 dark:text-gray-300 mb-4">
        Tus servicios activos
      </h3>

      {services.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No tienes servicios activos actualmente.
        </p>
      ) : (
        <ul className="space-y-4">
          {services.map((service) => (
            <li
              key={service._id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-md transition"
            >
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                {service.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {service.description}
              </p>
              <p
                className={`mt-2 text-sm font-medium ${
                  service.status === "activo"
                    ? "text-green-500"
                    : service.status === "pendiente"
                    ? "text-yellow-500"
                    : "text-gray-400"
                }`}
              >
                Estado: {service.status}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Creado: {new Date(service.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
