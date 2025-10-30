import { Routes, Route, Navigate } from "react-router-dom";

// 🧱 Layouts
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// 🌍 Páginas públicas
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Contacto from "@/pages/Contacto";

// 🔐 Páginas privadas
import Dashboard from "@/pages/DashboardHom";
import Services from "@/pages/Services";

// 🧩 Rutas protegidas
import PrivateRoute from "./PrivateRoute";

const AppRouter = () => {
  return (
    <div className="min-h-screen flex flex-col text-neutral-dark dark:text-neutral-light transition-colors duration-300">
      <Routes>
        {/* 🏠 Página Home con fondo propio (sin Navbar ni Footer) */}
        <Route
          path="/"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-cyan-400 to-green-300 text-white">
              <Home />
            </div>
          }
        />

        {/* 🌍 Rutas públicas con layout estándar */}
        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <main className="flex-1 container mx-auto p-6">
                <Login />
              </main>
              <Footer />
            </>
          }
        />

        <Route
          path="/register"
          element={
            <>
              <Navbar />
              <main className="flex-1 container mx-auto p-6">
                <Register />
              </main>
              <Footer />
            </>
          }
        />

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

        {/* 🔒 Rutas protegidas con layout */}
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />
        </Route>

        {/* 🚫 Redirección global */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default AppRouter;
