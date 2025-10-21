import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsx(Router, { children: _jsx(AuthProvider, { children: _jsxs("div", { className: "min-h-screen flex flex-col bg-neutral-light dark:bg-neutral-dark text-neutral-dark dark:text-neutral-light transition-colors duration-300", children: [_jsx(Navbar, {}), _jsx("main", { className: "flex-1 container mx-auto p-6", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/contacto", element: _jsx(Contacto, {}) }), _jsxs(Route, { element: _jsx(PrivateRoute, {}), children: [_jsx(Route, { path: "/dashboard", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/services", element: _jsx(Services, {}) })] }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }), _jsx(Footer, {})] }) }) }));
};
export default AppRouter;
