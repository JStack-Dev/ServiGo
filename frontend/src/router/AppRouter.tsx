import { Routes, Route, Navigate } from "react-router-dom";

// 🧱 Layouts
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// 🌍 Páginas públicas
import Home from "@/pages/Home";
import Register from "@/pages/Register";
import Contacto from "@/pages/Contacto";

// 🔐 Páginas privadas
import Dashboard from "@/pages/DashboardHom";
import Services from "@/pages/Services";
import Profile from "@/pages/Profile";

// 🧩 Rutas protegidas
import PrivateRoute from "./PrivateRoute";

const AppRouter = () => {
  return (
    <div className="min-h-screen flex flex-col text-neutral-dark dark:text-neutral-light transition-colors duration-300">
      <Routes>
        {/* 🏠 Página principal (Inicio de sesión moderno) */}
        <Route
          path="/"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-cyan-400 to-green-300 text-white">
              <Home />
            </div>
          }
        />

        {/* 🧾 Registro moderno */}
        <Route
          path="/register"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-cyan-400 to-green-300 text-white">
              <Register />
            </div>
          }
        />

        {/* 🌐 Contacto con layout */}
        <Route
          path="/contacto"
          element={
            <>
              <Navbar />
              <main className="flex-1 container mx-auto p-6">
                <Contacto />
              </main>
              <Footer />
            </>
          }
        />

        {/* 🔒 Áreas privadas (requieren autenticación) */}
        <Route
          element={
            <>
              <Navbar />
              <main className="flex-1 container mx-auto p-6">
                <PrivateRoute />
              </main>
              <Footer />
            </>
          }
        >
          <Route path="/perfil" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />
        </Route>

        {/* 🚫 Redirección global (404 → Home) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default AppRouter;
