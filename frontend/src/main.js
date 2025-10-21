import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "@styles/global.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/authContext";
import { NotificationProvider } from "@/context/NotificationContext"; // 🟢 Añadido
import { Toaster } from "react-hot-toast"; // 🔔 Sistema visual de alertas
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsx(BrowserRouter, { children: _jsx(ThemeProvider, { children: _jsx(AuthProvider, { children: _jsxs(NotificationProvider, { children: [_jsx(App, {}), _jsx(Toaster, { position: "bottom-right", reverseOrder: false })] }) }) }) }) }));
