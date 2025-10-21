"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/authContext";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, } from "recharts";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
export default function StatsDashboard() {
    const { token } = useAuth();
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    // 🎨 Colores de las gráficas
    const COLORS = ["#00C49F", "#0088FE", "#FFBB28", "#FF8042"];
    // 📊 Cargar métricas desde el backend
    useEffect(() => {
        if (!token)
            return;
        const fetchMetrics = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/metrics`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMetrics(res.data);
            }
            catch (error) {
                console.error("❌ Error al obtener métricas:", error);
                toast.error("Error al obtener métricas del sistema");
            }
            finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, [token]);
    if (loading)
        return _jsx("p", { className: "text-center mt-6", children: "Cargando m\u00E9tricas..." });
    if (!metrics)
        return (_jsx("p", { className: "text-center mt-6 text-gray-500", children: "No hay datos disponibles." }));
    return (_jsxs("div", { className: "container mx-auto py-8 px-4", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-center", children: "\uD83D\uDCC8 Panel de Estad\u00EDsticas \u2013 ServiGo" }), _jsxs(motion.div, { className: "bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mb-8", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Tiempos de respuesta promedio" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: metrics.responseTimes, children: [_jsx(Line, { type: "monotone", dataKey: "avgResponse", stroke: "#00C49F", strokeWidth: 3 }), _jsx(CartesianGrid, { stroke: "#ccc", strokeDasharray: "5 5" }), _jsx(XAxis, { dataKey: "date" }), _jsx(YAxis, {}), _jsx(Tooltip, {})] }) })] }), _jsxs(motion.div, { className: "bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mb-8", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Distribuci\u00F3n de servicios por categor\u00EDa" }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie
                                // ✅ Corregido: tipado explícito compatible con Recharts
                                , { 
                                    // ✅ Corregido: tipado explícito compatible con Recharts
                                    data: metrics.servicesByCategory, dataKey: "count", nameKey: "category", outerRadius: 100, label: true, children: metrics.servicesByCategory.map((_, i) => (_jsx(Cell, { fill: COLORS[i % COLORS.length] }, i))) }), _jsx(Tooltip, {})] }) })] }), _jsxs(motion.div, { className: "bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 text-center", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Estado general del sistema" }), _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["Solicitudes totales:", " ", _jsx("span", { className: "font-bold", children: metrics.totalRequests })] }), _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["Promedio de respuesta:", " ", _jsxs("span", { className: "font-bold", children: [metrics.avgResponseTime, " ms"] })] }), _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: ["Usuarios activos:", " ", _jsx("span", { className: "font-bold text-primary", children: metrics.activeUsers })] })] })] }));
}
