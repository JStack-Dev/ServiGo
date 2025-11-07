"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getStatsOverview } from "@/api/admin";
import MetricsOverview from "./MetricsOverview";
import UsersTable from "./UsersTable";
import ServicesTable from "./ServicesTable";
import BookingsTable from "./BookingsTable";
import { BarChart3, Users, Briefcase, FileText } from "lucide-react";
import LogsViewer from "./LogsViewer";

/* ============================================================
   🧠 Tipado fuerte
============================================================ */
interface StatsOverview {
  totalUsers: number;
  totalServices: number;
  totalBookings: number;
  totalRevenue: number;
}

/* ============================================================
   🧰 Dashboard Admin
============================================================ */
export default function DashboardAdmin(): JSX.Element {
  const [stats, setStats] = useState<StatsOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("overview");

  /* ============================================================
     🚀 Cargar métricas iniciales
  ============================================================ */
  useEffect(() => {
    const fetchStats = async (): Promise<void> => {
      try {
        const res = await getStatsOverview();
        // Verificamos que el backend devuelve un objeto con las claves esperadas
        if (res?.data) {
          setStats({
            totalUsers: res.data.totalUsers ?? 0,
            totalServices: res.data.totalServices ?? 0,
            totalBookings: res.data.totalBookings ?? 0,
            totalRevenue: res.data.totalRevenue ?? 0,
          });
        }
      } catch (err) {
        console.error("❌ Error cargando métricas:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  /* ============================================================
     ⏳ Estado de carga
  ============================================================ */
  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600 dark:text-gray-300 animate-pulse">
        Cargando panel...
      </p>
    );
  }

  /* ============================================================
     🎨 Render principal
  ============================================================ */
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {[
          { key: "overview", label: "Métricas", icon: BarChart3 },
          { key: "users", label: "Usuarios", icon: Users },
          { key: "services", label: "Servicios", icon: Briefcase },
          { key: "bookings", label: "Reservas", icon: FileText },
          { key: "logs", label: "Logs", icon: FileText },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition 
              ${
                activeTab === key
                  ? "bg-primary text-white"
                  : "bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      {/* Contenido dinámico */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {activeTab === "overview" && stats && <MetricsOverview stats={stats} />}
        {activeTab === "users" && <UsersTable />}
        {activeTab === "services" && <ServicesTable />}
        {activeTab === "bookings" && <BookingsTable />}
        {activeTab === "logs" && <LogsViewer />}
      </motion.div>
    </div>
  );
}
