// ==============================
// 📊 metrics.service.js – ServiGo
// ==============================

import os from "os";

let totalRequests = 0;
let totalErrors = 0;
let total4xx = 0;
let total5xx = 0;
let activeSockets = 0;
let avgResponseTime = 0;
let lastRequests = [];

// 🧮 Registrar métricas en tiempo real
export const recordRequest = (statusCode, responseTime) => {
  totalRequests++;
  avgResponseTime =
    (avgResponseTime * (totalRequests - 1) + responseTime) / totalRequests;

  if (statusCode >= 400 && statusCode < 500) total4xx++;
  if (statusCode >= 500) total5xx++;
};

// 🧩 Actualizar cantidad de usuarios conectados (desde Socket.IO)
export const updateActiveSockets = (count) => {
  activeSockets = count;
};

// 📊 Obtener todas las métricas
export const getMetrics = () => {
  return {
    system: {
      uptime: os.uptime(),
      load: os.loadavg(),
      memory: {
        free: os.freemem(),
        total: os.totalmem(),
      },
      platform: os.platform(),
      cpuCount: os.cpus().length,
    },
    app: {
      totalRequests,
      total4xx,
      total5xx,
      avgResponseTime: Number(avgResponseTime.toFixed(2)),
      activeSockets,
      lastUpdated: new Date().toISOString(),
    },
  };
};

