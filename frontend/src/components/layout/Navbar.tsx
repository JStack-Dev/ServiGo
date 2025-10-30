"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Hammer, AlertTriangle, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);

  const categories = [
    "Carpintero",
    "Albañil",
    "Fontanero",
    "Electricista",
    "Pintor",
    "Jardinero",
    "Cerrajero",
  ];

  return (
    <nav className="bg-white dark:bg-neutral-900 shadow-md py-3 px-6 flex justify-between items-center fixed top-0 left-0 w-full z-50">
      {/* 🔧 Izquierda: Menú de categorías + Reportar */}
      <div className="flex items-center gap-4">
        {/* Botón Categorías */}
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

          {/* Submenú */}
          <AnimatePresence>
            {openMenu && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 mt-2 bg-white dark:bg-neutral-800 shadow-lg rounded-lg w-48 overflow-hidden border border-gray-100 dark:border-neutral-700"
              >
                {categories.map((cat, index) => (
                  <li key={index}>
                    <Link
                      to={`/services?category=${cat.toLowerCase()}`}
                      className="block px-4 py-2 hover:bg-primary hover:text-white transition"
                      onClick={() => setOpenMenu(false)}
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Botón Reportar incidencia */}
        <Link
          to="/reportar"
          className="flex items-center gap-1 text-gray-800 dark:text-gray-100 font-medium hover:text-primary transition"
        >
          <AlertTriangle className="w-5 h-5" />
          Reportar incidencia
        </Link>
      </div>

      {/* 👤 Derecha: Registro */}
      <div>
        <Link
          to="/register"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full font-medium hover:bg-primary-dark transition"
        >
          <UserPlus className="w-5 h-5" />
          Registrarse
        </Link>
      </div>
    </nav>
  );
}
