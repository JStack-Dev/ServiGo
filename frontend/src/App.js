import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/App.tsx
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
const Dashboard = lazy(() => import("./pages/dashboard"));
function App() {
    return (_jsx(Suspense, { fallback: _jsx("div", { className: "p-6 text-center", children: "Cargando..." }), children: _jsx(Routes, { children: _jsxs(Route, { element: _jsx(MainLayout, {}), children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/servicios", element: _jsx(Servicios, {}) }), _jsx(Route, { path: "/contacto", element: _jsx(Contacto, {}) }), _jsx(Route, { path: "/notificaciones", element: _jsx(Notificaciones, {}) }), _jsx(Route, { path: "/chats", element: _jsx(Chats, {}) }), _jsx(Route, { path: "/chat/:id", element: _jsx(Chat, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(Dashboard, {}) })] }) }) }));
}
export default App;
