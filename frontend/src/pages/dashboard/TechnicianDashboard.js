import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/context/authContext";
export default function TechnicianDashboard() {
    const { user } = useAuth();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);
    useEffect(() => {
        const fetchAssignedServices = async () => {
            try {
                const res = await api.get("/services/assigned");
                setServices(res.data.services);
            }
            catch (err) {
                console.error("❌ Error al cargar servicios asignados:", err);
                setError("No se pudieron cargar tus servicios asignados.");
            }
            finally {
                setLoading(false);
            }
        };
        fetchAssignedServices();
    }, []);
    const handleStatusChange = async (id, newStatus) => {
        try {
            setUpdating(true);
            await api.patch(`/services/${id}/status`, { status: newStatus });
            setServices((prev) => prev.map((s) => (s._id === id ? { ...s, status: newStatus } : s)));
        }
        catch (err) {
            console.error("❌ Error al actualizar el estado:", err);
            setError("No se pudo actualizar el estado del servicio.");
        }
        finally {
            setUpdating(false);
        }
    };
    if (loading)
        return _jsx("p", { className: "text-center mt-10", children: "Cargando servicios asignados..." });
    if (error)
        return _jsx("p", { className: "text-center mt-10 text-red-500", children: error });
    return (_jsxs("section", { className: "max-w-5xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6", children: "Panel del T\u00E9cnico \uD83D\uDD27" }), services.length === 0 ? (_jsx("p", { className: "text-gray-500 dark:text-gray-400", children: "No tienes servicios asignados actualmente." })) : (_jsx("ul", { className: "space-y-4", children: services.map((service) => (_jsxs("li", { className: "p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-md transition", children: [_jsx("h4", { className: "font-semibold text-gray-900 dark:text-gray-100", children: service.title }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: service.description }), _jsxs("div", { className: "flex items-center justify-between mt-3", children: [_jsx("span", { className: `px-3 py-1 rounded-full text-sm font-medium ${service.status === "pendiente"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : service.status === "en curso"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-green-100 text-green-700"}`, children: service.status.toUpperCase() }), _jsxs("select", { disabled: updating, value: service.status, onChange: (e) => handleStatusChange(service._id, e.target.value), className: "text-sm border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1 bg-white dark:bg-gray-800", children: [_jsx("option", { value: "pendiente", children: "Pendiente" }), _jsx("option", { value: "en curso", children: "En curso" }), _jsx("option", { value: "completado", children: "Completado" })] })] })] }, service._id))) }))] }));
}
