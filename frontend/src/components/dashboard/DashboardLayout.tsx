"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import SidebarProfesional from "@/components/dashboard/SidebarProfesional";
import ProfileProfesional from "@/pages/ProfileProfesional";
import JobsActive from "@/components/professional/JobsActive";
import JobsCompleted from "@/components/professional/JobsCompleted";
import OffersIncoming from "@/components/professional/OffersIncoming";

export default function DashboardLayout() {
  const [section, setSection] = useState<string>("perfil");

  // 🔁 Render dinámico de cada sección
  const renderSection = () => {
    switch (section) {
      case "perfil":
        return <ProfileProfesional />;
      case "trabajos":
        return (
          <div className="flex flex-col gap-6">
            <JobsActive />
            <JobsCompleted />
            <OffersIncoming />
          </div>
        );
      case "metricas":
        return (
          <div className="text-center text-gray-700 dark:text-gray-300">
            <h2 className="text-2xl font-bold mb-4">📊 Métricas profesionales</h2>
            <p>Próximamente aquí mostraremos estadísticas y progreso.</p>
          </div>
        );
      case "ajustes":
        return (
          <div className="text-center text-gray-700 dark:text-gray-300">
            <h2 className="text-2xl font-bold mb-4">⚙️ Ajustes</h2>
            <p>Configuración de notificaciones, disponibilidad y seguridad.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      <SidebarProfesional onSelect={setSection} />

      {/* Contenido principal */}
      <motion.main
        key={section}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 p-10 pl-72"
      >
        {renderSection()}
      </motion.main>
    </div>
  );
}
