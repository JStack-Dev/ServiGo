// ==============================
// 📁 upload.middleware.js
// Manejo avanzado de archivos con Multer
// ==============================

import multer from "multer";
import path from "path";
import fs from "fs";

// 📂 Crear carpeta base "uploads" si no existe
const baseDir = path.resolve("uploads");
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir);
}

/* ============================================================
   🧱 Configuración de almacenamiento genérica
============================================================ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

/* ============================================================
   🧩 Filtro de tipo de archivo
============================================================ */
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de archivo no permitido"), false);
  }
};

/* ============================================================
   📸 Middleware genérico de subida
============================================================ */
export const upload = multer({ storage, fileFilter });

/* ============================================================
   🧩 Subida específica para incidencias (fotos)
============================================================ */
const INCIDENTS_DIR = path.resolve("uploads/incidencias");

// Crear carpeta "uploads/incidencias" si no existe
if (!fs.existsSync(INCIDENTS_DIR)) {
  fs.mkdirSync(INCIDENTS_DIR, { recursive: true });
}

// Almacenamiento especializado
const incidentStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, INCIDENTS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `incidencia-${Date.now()}${ext}`;
    cb(null, name);
  },
});

export const uploadIncidentImage = multer({
  storage: incidentStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
