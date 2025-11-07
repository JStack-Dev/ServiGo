"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/context/authContext";

interface Service {
  _id: string;
  title: string;
  description: string;
  client?: { name: string; email: string };
  updatedAt: string;
}

export default function JobsCompleted() {
  const { token } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/services/completed`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices(res.data);
      } catch (error) {
        console.error("❌ Error al obtener servicios completados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompleted();
  }, [token]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-20 text-gray-200">
        <Loader2 className="animate-spin mr-2" /> Cargando historial...
      </div>
    );

  if (services.length === 0)
    return <p className="text-center text-gray-300 mt-10">Aún no has completado ningún servicio.</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {services.map((service) => (
        <motion.div
          key={service._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-white/20 shadow-md"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={22} className="text-green-400" />
            <h3 className="text-lg font-semibold">{service.title}</h3>
          </div>
          <p className="text-sm text-gray-200 mb-2">{service.description}</p>
          <p className="text-xs text-gray-400">Cliente: {service.client?.name || "N/A"}</p>
          <p className="text-xs text-gray-500">
            Finalizado: {new Date(service.updatedAt).toLocaleDateString()}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
