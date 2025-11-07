import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import "@styles/global.css";

// 🧩 Contextos globales
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/authContext";
import { NotificationProvider } from "@/context/NotificationContext";

// 🛎️ Sistema de notificaciones global con Sonner
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <AppRouter />
            {/* 🧠 Toaster global (notificaciones en tiempo real) */}
            <Toaster
              position="bottom-right"
              richColors
              toastOptions={{
                duration: 3500,
                className: "shadow-lg rounded-xl font-medium",
              }}
            />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
