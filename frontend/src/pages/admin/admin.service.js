/* eslint-env node */
/* ============================================================
   🧠 Servicio de administración — Node.js
   ============================================================ */

import fs from "fs";
import path from "path";
// import User from "../users/user.model.js";
// import Service from "../services/service.model.js";
// import Booking from "../bookings/booking.model.js";
// import Payment from "../payments/payment.model.js";

// 📁 Ruta del archivo donde Winston guarda los logs
const LOG_FILE = path.resolve("logs", "combined.log");

/* ============================================================
   🧩 Servicio principal del panel admin
   ============================================================ */
export const AdminService = {
  /**
   * 📜 Obtiene los últimos 100 logs del sistema desde Winston
   * Si el archivo no existe, devuelve un array vacío.
   */
  async getSystemLogs() {
    try {
      if (!fs.existsSync(LOG_FILE)) {
        return [];
      }

      const content = fs.readFileSync(LOG_FILE, "utf-8");

      // Cada línea representa un log JSON (formato estándar de Winston)
      const lines = content
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          try {
            return JSON.parse(line);
          } catch {
            return { level: "info", message: line };
          }
        });

      // Devolver los 100 logs más recientes en orden descendente
      return lines.slice(-100).reverse();
    } catch (err) {
      console.error("❌ Error al leer logs:", err);
      return [];
    }
  },
};
