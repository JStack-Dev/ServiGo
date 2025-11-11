"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Hammer, AlertTriangle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getCategories } from "@/services/user.service";

/* ============================================================
   🧭 Navbar — ServiGo (versión dinámica)
   Muestra categorías reales del backend
============================================================ */
export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Cargar categorías desde el backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        const categoryNames = data.map((cat) => cat.specialty);
        setCategories(categoryNames);
      } catch (error) {
        console.error("❌ Error al cargar categorías:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // 🔹 Navegar a la página de la categoría
  const handleCategoryClick = (category: string) => {
    navigate(`/categorias/${encodeURIComponent(category)}`);
    setOpenMenu(false);
  };

  return (
    <nav className="bg-white dark:bg-neutral-900 shadow-md py-3 px-6 flex justify-between items-center fixed top-0 left-0 w-full z-50">
      {/* 🔧 Izquierda: Menú de categorías + Reportar */}
      <div className="flex items-center gap-4">
        {/* 📂 Botón Categorías */}
        <div className="relative">
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="flex items-center gap-1 text-gray-800 dark:text-gray-100 font-medium hover:text-primary transition"
          >
            <Hammer className="w-5 h-5" />
            Categorías
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                openMenu ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {/* 📋 Submenú dinámico */}
          <AnimatePresence>
            {openMenu && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 mt-2 bg-white dark:bg-neutral-800 shadow-lg rounded-lg w-52 overflow-hidden border border-gray-100 dark:border-neutral-700"
              >
                {loading ? (
                  <li className="px-4 py-2 text-gray-500 text-sm">
                    Cargando categorías...
                  </li>
                ) : categories.length > 0 ? (
                  categories.map((cat, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleCategoryClick(cat)}
                        className="block w-full text-left px-4 py-2 hover:bg-primary hover:text-white transition"
                      >
                        {cat}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500 text-sm">
                    Sin categorías disponibles
                  </li>
                )}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* ⚠️ Botón Reportar incidencia */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/reportar-incidencia"
            className="flex items-center gap-1 text-gray-800 dark:text-gray-100 font-medium hover:text-primary transition"
          >
            <AlertTriangle className="w-5 h-5" />
            Reportar incidencia
          </Link>
        </motion.div>
      </div>
    </nav>
  );
}
