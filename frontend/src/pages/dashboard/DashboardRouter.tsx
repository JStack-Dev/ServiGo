"use client";
import { useAuth } from "@/context/authContext";
import { Navigate } from "react-router-dom";
import { AdminDashboard, TechnicianDashboard, ClientDashboard } from ".";
import { useEffect } from "react";

export default function DashboardRouter() {
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log("🔍 Usuario autenticado:", user);
  }, [user]);

  if (loading) return <p className="text-center mt-10">Cargando...</p>;
  if (!user) return <Navigate to="/login" />;

  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "profesional":
      return <TechnicianDashboard />;
    case "cliente":
      return <ClientDashboard />;
    default:
      return <p className="text-center mt-10 text-gray-500">Rol no reconocido</p>;
  }
}
