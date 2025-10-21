// ==============================
// ⚙️ Vite Config – ServiGo Frontend
// Optimización + Alias + Visualizer
// ==============================

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "dist/stats.html", // 📊 genera un informe visual del bundle
      open: false, // cámbialo a true si quieres que se abra automáticamente tras el build
      gzipSize: true,
      brotliSize: true,
    }),
  ],

  // ==============================
  // 🧭 Alias de rutas (importaciones limpias)
  // ==============================
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@layouts": path.resolve(__dirname, "./src/layouts"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@api": path.resolve(__dirname, "./src/api"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@context": path.resolve(__dirname, "./src/context"),
    },
  },

  // ==============================
  // 🧩 Servidor de desarrollo
  // ==============================
  server: {
    port: 5173,
    open: true,
  },

  // ==============================
  // ⚡ Configuración de build optimizada
  // ==============================
  build: {
    minify: "esbuild", // ⚙️ compilación rápida y ligera
    sourcemap: false,
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});
