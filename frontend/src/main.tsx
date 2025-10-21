import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "@styles/global.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/authContext";
import { NotificationProvider } from "@/context/NotificationContext"; // 🟢 Añadido
import { Toaster } from "react-hot-toast"; // 🔔 Sistema visual de alertas

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <App />
            {/* 🟡 Contenedor global de toasts */}
            <Toaster position="bottom-right" reverseOrder={false} />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
