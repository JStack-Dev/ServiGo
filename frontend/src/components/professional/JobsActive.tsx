"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2, Wrench } from "lucide-react";
import { useAuth } from "@/context/authContext";

interface Service {
  _id: string;
  title: string;
  description: string;
  status: string;
  client?: { name: string; email: string };
  createdAt: string;
}

export default function JobsActive() {
  const { token } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/services/active`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices(res.data);
      } catch (error) {
        console.error("❌ Error al obtener servicios activos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [token]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-20 text-gray-200">
        <Loader2 className="animate-spin mr-2" /> Cargando servicios...
      </div>
    );

  if (services.length === 0)
    return <p className="text-center text-gray-300 mt-10">No tienes trabajos activos.</p>;

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
            <Wrench size={22} className="text-blue-300" />
            <h3 className="text-lg font-semibold">{service.title}</h3>
          </div>
          <p className="text-sm text-gray-200 mb-2">{service.description}</p>
          <p className="text-xs text-gray-400">
            Cliente: {service.client?.name || "Desconocido"}
          </p>
          <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs bg-blue-500/60 text-white">
            {service.status}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
