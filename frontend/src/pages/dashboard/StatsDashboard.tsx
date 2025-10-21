"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/authContext";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// 🧩 Tipos de datos esperados del backend
interface ResponseTime {
  date: string;
  avgResponse: number;
}

interface ServiceCategory {
  category: string;
  count: number;
  [key: string]: string | number; // Permite compatibilidad con Recharts
}

interface Metrics {
  responseTimes: ResponseTime[];
  servicesByCategory: ServiceCategory[];
  totalRequests: number;
  avgResponseTime: number;
  activeUsers: number;
}

export default function StatsDashboard() {
  const { token } = useAuth();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  // 🎨 Colores de las gráficas
  const COLORS = ["#00C49F", "#0088FE", "#FFBB28", "#FF8042"];

  // 📊 Cargar métricas desde el backend
  useEffect(() => {
    if (!token) return;

    const fetchMetrics = async () => {
      try {
        const res = await axios.get<Metrics>(
          `${import.meta.env.VITE_API_URL}/metrics`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMetrics(res.data);
      } catch (error) {
        console.error("❌ Error al obtener métricas:", error);
        toast.error("Error al obtener métricas del sistema");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [token]);

  if (loading) return <p className="text-center mt-6">Cargando métricas...</p>;
  if (!metrics)
    return (
      <p className="text-center mt-6 text-gray-500">
        No hay datos disponibles.
      </p>
    );

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">
        📈 Panel de Estadísticas – ServiGo
      </h2>

      {/* 🔹 Gráfica de rendimiento */}
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-semibold mb-4">
          Tiempos de respuesta promedio
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={metrics.responseTimes}>
            <Line
              type="monotone"
              dataKey="avgResponse"
              stroke="#00C49F"
              strokeWidth={3}
            />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* 🔹 Distribución de servicios */}
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold mb-4">
          Distribución de servicios por categoría
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              // ✅ Corregido: tipado explícito compatible con Recharts
              data={metrics.servicesByCategory as { [key: string]: string | number }[]}
              dataKey="count"
              nameKey="category"
              outerRadius={100}
              label
            >
              {metrics.servicesByCategory.map(
                (_: ServiceCategory, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                )
              )}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* 🔹 Estado del sistema */}
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold mb-4">
          Estado general del sistema
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Solicitudes totales:{" "}
          <span className="font-bold">{metrics.totalRequests}</span>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Promedio de respuesta:{" "}
          <span className="font-bold">{metrics.avgResponseTime} ms</span>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Usuarios activos:{" "}
          <span className="font-bold text-primary">
            {metrics.activeUsers}
          </span>
        </p>
      </motion.div>
    </div>
  );
}
