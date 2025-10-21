import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/context/authContext";
export default function AdminDashboard() {
    const { user } = useAuth();
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const res = await api.get("/dashboard/metrics");
                setMetrics(res.data);
            }
            catch (err) {
                console.error("❌ Error al cargar métricas:", err);
                setError("No se pudieron cargar las métricas del sistema.");
            }
            finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);
    if (loading)
        return _jsx("p", { className: "text-center mt-10", children: "Cargando panel de administrador..." });
    if (error)
        return _jsx("p", { className: "text-center mt-10 text-red-500", children: error });
    return (_jsxs("section", { className: "max-w-6xl mx-auto mt-10 p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg", children: [_jsx("h2", { className: "text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6", children: "Panel del Administrador \uD83D\uDEE0\uFE0F" }), _jsxs("p", { className: "text-gray-600 dark:text-gray-300 mb-8", children: ["Bienvenido, ", _jsx("strong", { children: user?.name }), ". Aqu\u00ED tienes una visi\u00F3n general del sistema ServiGo."] }), metrics && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [_jsxs("div", { className: "p-4 rounded-xl bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 shadow", children: [_jsx("h3", { className: "text-sm uppercase font-semibold", children: "Usuarios Totales" }), _jsx("p", { className: "text-2xl font-bold", children: metrics.totalUsers })] }), _jsxs("div", { className: "p-4 rounded-xl bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 shadow", children: [_jsx("h3", { className: "text-sm uppercase font-semibold", children: "Servicios Totales" }), _jsx("p", { className: "text-2xl font-bold", children: metrics.totalServices })] }), _jsxs("div", { className: "p-4 rounded-xl bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 shadow", children: [_jsx("h3", { className: "text-sm uppercase font-semibold", children: "T\u00E9cnicos Activos" }), _jsx("p", { className: "text-2xl font-bold", children: metrics.activeTechnicians })] }), _jsxs("div", { className: "p-4 rounded-xl bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 shadow", children: [_jsx("h3", { className: "text-sm uppercase font-semibold", children: "Solicitudes Pendientes" }), _jsx("p", { className: "text-2xl font-bold", children: metrics.pendingRequests })] })] })), _jsxs("div", { className: "mt-10", children: [_jsx("h3", { className: "text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3", children: "Pr\u00F3ximas mejoras" }), _jsxs("ul", { className: "list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1", children: [_jsx("li", { children: "Panel de control de seguridad (alertas antifraude e IA)" }), _jsx("li", { children: "Gesti\u00F3n de usuarios y t\u00E9cnicos desde la interfaz" }), _jsx("li", { children: "Visualizaci\u00F3n en tiempo real con gr\u00E1ficos (recharts o Chart.js)" })] })] })] }));
}
