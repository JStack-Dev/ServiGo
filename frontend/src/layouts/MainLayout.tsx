import { Outlet } from "react-router-dom";
import Navbar from "@components/layout/Navbar";
import Footer from "@components/layout/Footer";
import ThemeToggle from "@components/ui/ThemeToggle";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-light dark:bg-neutral-dark text-neutral-dark dark:text-neutral-light transition-colors duration-300">
      {/* 🌙 Botón de cambio de tema global */}
      <ThemeToggle />

      {/* 🌐 Cabecera y navegación */}
      <Navbar />

      {/* 📄 Contenido principal (renderiza las páginas) */}
      <main className="flex-1 container mx-auto p-6">
        <Outlet />
      </main>

      {/* ⚙️ Pie de página */}
      <Footer />
    </div>
  );
}
