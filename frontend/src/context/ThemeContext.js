/* eslint-disable react-refresh/only-export-components */
"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState, } from "react";
const ThemeContext = createContext(undefined);
// 🧠 Detecta tema inicial (localStorage o sistema)
const getInitialTheme = () => {
    const stored = localStorage.getItem("theme");
    if (stored)
        return stored;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
};
export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(getInitialTheme);
    // 🌙 Aplica la clase "dark" al <html> cuando cambia el tema
    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        }
        else {
            root.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);
    const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));
    return (_jsx(ThemeContext.Provider, { value: { theme, toggleTheme }, children: children }));
}
export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return ctx;
}
