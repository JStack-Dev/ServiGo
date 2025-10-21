import { jsx as _jsx } from "react/jsx-runtime";
import { useTheme } from "@/context/ThemeContext";
export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    return (_jsx("button", { onClick: toggleTheme, className: "fixed bottom-4 right-4 z-50 rounded-xl bg-primary text-white px-3 py-2 shadow-lg hover:opacity-90 focus:outline-none transition-all", "aria-label": "Cambiar tema", title: "Cambiar tema", children: theme === "dark" ? "🌙 Modo Oscuro" : "☀️ Modo Claro" }));
}
