"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useAuth } from "@/context/authContext";
import { Navigate } from "react-router-dom";
import { AdminDashboard, TechnicianDashboard, ClientDashboard } from ".";
import { useEffect } from "react";
export default function DashboardRouter() {
    const { user, loading } = useAuth();
    useEffect(() => {
        console.log("🔍 Usuario autenticado:", user);
    }, [user]);
    if (loading)
        return _jsx("p", { className: "text-center mt-10", children: "Cargando..." });
    if (!user)
        return _jsx(Navigate, { to: "/login" });
    switch (user.role) {
        case "admin":
            return _jsx(AdminDashboard, {});
        case "profesional":
            return _jsx(TechnicianDashboard, {});
        case "cliente":
            return _jsx(ClientDashboard, {});
        default:
            return _jsx("p", { className: "text-center mt-10 text-gray-500", children: "Rol no reconocido" });
    }
}
