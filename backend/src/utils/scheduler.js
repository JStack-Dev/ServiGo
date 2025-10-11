// ==============================
// ⏰ scheduler.js (unificado y optimizado)
// ==============================

import cron from "node-cron";
import Service from "../models/Service.js";
import { io } from "../index.js";
import { analyzeSecurityPatterns } from "../services/aiSecurity.service.js";
import { sendSecurityAlert } from "./alertManager.js";

let schedulersStarted = false; // ⚙️ Previene ejecución múltiple de cron jobs

// 🕒 Inicia todos los cron jobs del sistema
export function startSchedulers() {
  if (schedulersStarted) return; // 🚫 Evita duplicar tareas si ya están activas
  schedulersStarted = true;

  console.log("🕒 Iniciando tareas programadas...");

  // ============================================================
  // 🗓️ Revisión cada hora de servicios programados (recordatorios)
  // ============================================================
  cron.schedule("0 * * * *", async () => {
    console.log("⏰ Revisión de servicios programados...");

    const now = new Date();
    const upcoming = new Date(now.getTime() + 60 * 60 * 1000); // Próximas 1h

    try {
      const services = await Service.find({
        scheduledDate: { $lte: upcoming, $gte: now },
        status: "pendiente",
      }).populate("professional client", "name email");

      for (const s of services) {
        io.emit("serviceReminder", {
          message: `📆 Recordatorio: el servicio "${s.title}" comenzará pronto`,
          serviceId: s._id,
          client: s.client?.name,
          professional: s.professional?.name,
          scheduledDate: s.scheduledDate,
        });
      }

      console.log(`✅ Revisados ${services.length} servicios programados`);
    } catch (error) {
      console.error("❌ Error al revisar servicios programados:", error.message);
    }
  });

//   // ============================================================
//   // 🧠 Escáner de seguridad automático (IA + cron cada hora)
//   // ============================================================
//   cron.schedule("30 * * * *", async () => {
//     // Ejecuta a la media de cada hora para no coincidir con el recordatorio
//     console.log("🧠 Ejecutando escáner de seguridad automático...");

//     try {
//       const report = await analyzeSecurityPatterns();

//       if (report.health === "inestable" || report.health === "crítico") {
//         await sendSecurityAlert({
//           title: "⚠️ Riesgo detectado en análisis de seguridad",
//           description: `Estado: ${report.health} | Problemas: ${report.mainIssues?.join(", ")}`,
//         });
//       }

//       console.log(`🧩 Estado del sistema: ${report.health || "sin datos"}`);
//     } catch (error) {
//       console.error("❌ Error en el escáner de seguridad:", error.message);
//     }
//   });
}
