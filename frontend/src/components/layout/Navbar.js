import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate("/login"); // Redirigir al login tras cerrar sesión
    };
    return (_jsxs("nav", { className: "bg-primary text-white px-6 py-4 flex justify-between items-center shadow-md", children: [_jsx(Link, { to: "/", className: "font-bold text-xl", children: "ServiGo" }), _jsxs("div", { className: "flex gap-4 items-center", children: [_jsx(Link, { to: "/services", className: "hover:underline", children: "Servicios" }), _jsx(Link, { to: "/contacto", className: "hover:underline", children: "Contacto" }), user ? (_jsxs(_Fragment, { children: [_jsxs("span", { className: "text-sm italic", children: ["\uD83D\uDC4B ", user.name] }), _jsx("button", { onClick: handleLogout, className: "bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition", children: "Cerrar sesi\u00F3n" })] })) : (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/login", className: "hover:underline", children: "Iniciar sesi\u00F3n" }), _jsx(Link, { to: "/register", className: "hover:underline", children: "Registrarse" })] }))] })] }));
}
