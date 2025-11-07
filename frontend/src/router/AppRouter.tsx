import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/authContext";

// 🧱 Layouts
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatButton from "@/components/common/ChatButton";
import ChatDirectButton from "@/components/common/ChatDirectButton";

// 🌍 Páginas públicas
import Home from "@/pages/Home";
import Register from "@/pages/Register";
import Contacto from "@/pages/Contacto";

// 🔐 Páginas privadas
import Dashboard from "@/pages/Dashboard";
import Services from "@/pages/Services";
import Profile from "@/pages/Profile";
import ProfileProfesional from "@/pages/ProfileProfesional";
import DashboardProfesional from "@/pages/DashboardProfesional";
import ReservarServicio from "@/pages/ReservarServicio";
import ReportarIncidencia from "@/pages/ReportarIncidencia";
import Mensajes from "@/pages/Mensajes";
import ChatsDirect from "@/pages/ChatsDirect";
import ChatDirect from "@/pages/ChatDirect"; // ✅ nueva importación

// 💬 Chat clásico
import Chats from "@/pages/Chats";
import ChatCliente from "@/pages/ChatCliente";
import ChatProfesional from "@/pages/ChatProfesional";

// 🧩 Rutas protegidas
import PrivateRoute from "./PrivateRoute";

// 🧰 Admin
import DashboardAdmin from "@/pages/admin/DashboardAdmin";

/* ==========================================================
   🔀 ChatRedirect — según rol
========================================================== */
const ChatRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === "profesional" ? <ChatProfesional /> : <ChatCliente />;
};

/* ==========================================================
   🧱 Layout privado (Navbar + Footer + Chat)
========================================================== */
const PrivateLayout = () => {
  const { user } = useAuth();
  const showNavbar = user?.role === "cliente";

  return (
    <>
      {showNavbar && <Navbar />}
      <main className="flex-1 container mx-auto p-6">
        <Outlet />
      </main>
      <Footer />
      <ChatButton />
      <ChatDirectButton /> {/* 💬 Acceso rápido a chats directos */}
    </>
  );
};

/* ==========================================================
   🚀 Enrutador principal
========================================================== */
const AppRouter = () => {
  return (
    <div className="min-h-screen flex flex-col text-neutral-dark dark:text-neutral-light transition-colors duration-300">
      <Routes>
        {/* 🏠 Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
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

        {/* 🔐 Privadas */}
        <Route element={<PrivateRoute />}>
          <Route element={<PrivateLayout />}>
            {/* 👤 Cliente */}
            <Route path="/perfil" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/services" element={<Services />} />

            {/* 💬 Chats estándar */}
            <Route path="/chats" element={<Chats />} />
            <Route path="/chat/:serviceId" element={<ChatRedirect />} />
            <Route
              path="/chat-profesional/:serviceId"
              element={<ChatProfesional />}
            />

            {/* 💬 Chats Directos */}
            <Route path="/chats-direct" element={<ChatsDirect />} />
            <Route path="/chat-direct/:chatId" element={<ChatDirect />} /> {/* ✅ Nueva ruta */}

            {/* 🧰 Profesional */}
            <Route path="/perfil-profesional" element={<ProfileProfesional />} />
            <Route path="/dashboard-profesional" element={<DashboardProfesional />} />

            {/* 🧾 Reportar incidencia */}
            <Route path="/reportar-incidencia" element={<ReportarIncidencia />} />

            {/* 📩 Mensajes */}
            <Route path="/mensajes" element={<Mensajes />} />
          </Route>
        </Route>

        {/* 📅 Reservas */}
        <Route path="/reservar/:serviceId" element={<ReservarServicio />} />

        {/* 🧑‍💼 Admin */}
        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<DashboardAdmin />} />
        </Route>

        {/* 🚫 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default AppRouter;
