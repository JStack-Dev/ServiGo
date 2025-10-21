import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/authContext";

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
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-neutral-light dark:bg-neutral-dark text-neutral-dark dark:text-neutral-light transition-colors duration-300">
          <Navbar />
          <main className="flex-1 container mx-auto p-6">
            <Routes>
              {/* 🌍 Rutas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contacto" element={<Contacto />} />

              {/* 🔒 Rutas protegidas */}
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/services" element={<Services />} />
              </Route>

              {/* 🚫 Redirección global */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default AppRouter;
