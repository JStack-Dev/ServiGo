import { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/context/authContext";

interface Service {
  _id: string;
  title: string;
  description: string;
  status: "pendiente" | "en curso" | "completado";
  createdAt: string;
}

export default function TechnicianDashboard() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchAssignedServices = async () => {
      try {
        const res = await api.get("/services/assigned");
        setServices(res.data.services);
      } catch (err) {
        console.error("❌ Error al cargar servicios asignados:", err);
        setError("No se pudieron cargar tus servicios asignados.");
      } finally {
        setLoading(false);
      }
    };
    fetchAssignedServices();
  }, []);

  const handleStatusChange = async (id: string, newStatus: Service["status"]) => {
    try {
      setUpdating(true);
      await api.patch(`/services/${id}/status`, { status: newStatus });
      setServices((prev) =>
        prev.map((s) => (s._id === id ? { ...s, status: newStatus } : s))
      );
    } catch (err) {
      console.error("❌ Error al actualizar el estado:", err);
      setError("No se pudo actualizar el estado del servicio.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando servicios asignados...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <section className="max-w-5xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Panel del Técnico 🔧
      </h2>

      {services.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No tienes servicios asignados actualmente.
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

              <div className="flex items-center justify-between mt-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    service.status === "pendiente"
                      ? "bg-yellow-100 text-yellow-700"
                      : service.status === "en curso"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {service.status.toUpperCase()}
                </span>

                <select
                  disabled={updating}
                  value={service.status}
                  onChange={(e) =>
                    handleStatusChange(service._id, e.target.value as Service["status"])
                  }
                  className="text-sm border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1 bg-white dark:bg-gray-800"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en curso">En curso</option>
                  <option value="completado">Completado</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
