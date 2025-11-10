// ==============================
// ⚙️ Vite Config – ServiGo Frontend
// Optimización + Alias + Tailwind + Vercel Ready
// ==============================

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "./", // ✅ garantiza rutas correctas en Vercel y GitHub Pages

    plugins: [
      react(),
      // El visualizer solo se ejecuta si haces build manual local (no en Vercel)
      ...(mode === "production"
        ? []
        : [
            visualizer({
              filename: "dist/stats.html",
              open: false,
              gzipSize: true,
              brotliSize: true,
            }),
          ]),
    ],

    css: {
      postcss: {
        plugins: [tailwindcss(), autoprefixer()],
      },
    },

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
        "@services": path.resolve(__dirname, "./src/services"),
      },
    },

    server: {
      port: 5173,
      open: true,
    },

    build: {
      outDir: "dist", // ✅ asegura que Vercel sepa dónde está el build
      minify: "esbuild",
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
  };
});
