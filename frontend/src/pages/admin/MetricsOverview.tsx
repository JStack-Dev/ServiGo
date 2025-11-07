import { Card, CardContent } from "@/components/ui/Card";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

/* ============================================================
   🧠 Tipado fuerte: métricas globales del panel admin
   ============================================================ */
export interface MetricsStats {
  totalUsers: number;
  totalBookings: number;
  totalIncome: number;
  activeBookings: number;
  completedBookings: number;
  canceledBookings: number;
}

/* ============================================================
   📊 Componente principal
   ============================================================ */
interface MetricsOverviewProps {
  stats: MetricsStats;
}

export default function MetricsOverview({ stats }: MetricsOverviewProps) {
  const chartData = [
    { name: "Activas", value: stats.activeBookings },
    { name: "Completadas", value: stats.completedBookings },
    { name: "Canceladas", value: stats.canceledBookings },
  ];

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Usuarios */}
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            Usuarios Totales
          </h3>
          <p className="text-3xl font-bold text-primary">
            {stats.totalUsers ?? 0}
          </p>
        </CardContent>
      </Card>

      {/* Reservas */}
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            Reservas Totales
          </h3>
          <p className="text-3xl font-bold text-primary">
            {stats.totalBookings ?? 0}
          </p>
        </CardContent>
      </Card>

      {/* Ingresos */}
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            Ingresos Totales (€)
          </h3>
          <p className="text-3xl font-bold text-primary">
            {stats.totalIncome?.toFixed(2) ?? "0.00"}
          </p>
        </CardContent>
      </Card>

      {/* Gráfico */}
      <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Estado de Reservas</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
