import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
import Navbar from "@components/layout/Navbar";
import Footer from "@components/layout/Footer";
import ThemeToggle from "@components/ui/ThemeToggle";
export default function MainLayout() {
    return (_jsxs("div", { className: "min-h-screen flex flex-col bg-neutral-light dark:bg-neutral-dark text-neutral-dark dark:text-neutral-light transition-colors duration-300", children: [_jsx(ThemeToggle, {}), _jsx(Navbar, {}), _jsx("main", { className: "flex-1 container mx-auto p-6", children: _jsx(Outlet, {}) }), _jsx(Footer, {})] }));
}
