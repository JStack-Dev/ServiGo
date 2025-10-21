import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { Suspense, lazy } from "react";

// Lazy imports
const Home = lazy(() => import("./pages/Home"));
const Servicios = lazy(() => import("./pages/Servicios"));
const Contacto = lazy(() => import("./pages/Contacto"));
const Notificaciones = lazy(() => import("./pages/Notificaciones"));
const Chats = lazy(() => import("./pages/Chats"));
const Chat = lazy(() => import("./pages/Chat"));
const Dashboard = lazy(() => import("./pages/Dashboard")); // si lo tienes

function App() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Cargando...</div>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/notificaciones" element={<Notificaciones />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
