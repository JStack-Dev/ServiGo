import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/context/authContext";
export default function ClientDashboard() {
    const { user } = useAuth();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await api.get("/services/mine");
                setServices(res.data.services);
            }
            catch (err) {
                console.error("❌ Error al cargar servicios:", err);
                setError("No se pudieron cargar tus servicios.");
            }
            finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);
    if (loading)
        return _jsx("p", { className: "text-center mt-10", children: "Cargando tus servicios..." });
    if (error)
        return _jsx("p", { className: "text-center mt-10 text-red-500", children: error });
    return (_jsxs("section", { className: "max-w-5xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg", children: [_jsxs("h2", { className: "text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6", children: ["Bienvenido, ", user?.name, " \uD83D\uDC4B"] }), _jsx("h3", { className: "text-lg text-gray-600 dark:text-gray-300 mb-4", children: "Tus servicios activos" }), services.length === 0 ? (_jsx("p", { className: "text-gray-500 dark:text-gray-400", children: "No tienes servicios activos actualmente." })) : (_jsx("ul", { className: "space-y-4", children: services.map((service) => (_jsxs("li", { className: "p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-md transition", children: [_jsx("h4", { className: "font-semibold text-gray-900 dark:text-gray-100", children: service.title }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: service.description }), _jsxs("p", { className: `mt-2 text-sm font-medium ${service.status === "activo"
                                ? "text-green-500"
                                : service.status === "pendiente"
                                    ? "text-yellow-500"
                                    : "text-gray-400"}`, children: ["Estado: ", service.status] }), _jsxs("p", { className: "text-xs text-gray-400 mt-1", children: ["Creado: ", new Date(service.createdAt).toLocaleDateString()] })] }, service._id))) }))] }));
}
