// ==============================
// 🚀 upload.routes.js
// Subida de archivos de chat – ServiGo
// ==============================

import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";

const router = express.Router();

// 📁 Directorio de subida
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ⚙️ Configuración de Multer
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// 🧠 Filtro de tipo de archivo
const fileFilter = (_, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
  ];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("❌ Tipo de archivo no permitido"), false);
};

const upload = multer({ storage, fileFilter });

// 📤 Endpoint principal
router.post("/", upload.single("file"), (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No se ha subido ningún archivo" });

    const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
    const fileUrl = `${backendUrl}/uploads/${req.file.filename}`;

    res.status(200).json({
      message: "✅ Archivo subido correctamente",
      url: fileUrl,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
    });
  } catch (error) {
    console.error("❌ Error al subir archivo:", error);
    res.status(500).json({ error: "Error al procesar la subida" });
  }
});

export default router;
