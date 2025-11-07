"use client";
import { motion } from "framer-motion";
import { Briefcase, BarChart3, Settings, User } from "lucide-react";
import { useState } from "react";

export default function SidebarProfesional({ onSelect }: { onSelect: (section: string) => void }) {
  const [active, setActive] = useState("perfil");

  const menuItems = [
    { id: "perfil", label: "Perfil", icon: <User className="w-5 h-5" /> },
    { id: "trabajos", label: "Mis trabajos", icon: <Briefcase className="w-5 h-5" /> },
    { id: "metricas", label: "Métricas", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "ajustes", label: "Ajustes", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-900 shadow-lg flex flex-col py-8 px-4"
    >
      <h2 className="text-2xl font-bold text-primary mb-8 text-center">ServiGo Pro</h2>

      <nav className="flex flex-col gap-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActive(item.id);
              onSelect(item.id);
            }}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
              ${active === item.id
                ? "bg-gradient-to-r from-blue-600 via-cyan-400 to-green-300 text-white shadow-md"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
    </motion.aside>
  )
}
