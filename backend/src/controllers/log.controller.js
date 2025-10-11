// 📁 src/controllers/log.controller.js
import Log from "../models/Log.js";

// 📄 Obtener todos los logs
export const getAllLogs = async (req, res) => {
  try {
    const logs = await Log.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    console.error("❌ Error al obtener logs:", error);
    res.status(500).json({ error: "Error al obtener logs" });
  }
};

// 🧹 Limpiar todos los logs
export const clearLogs = async (req, res) => {
  try {
    await Log.deleteMany({});
    res.json({ message: "Todos los logs han sido eliminados 🧹" });
  } catch (error) {
    console.error("❌ Error al eliminar logs:", error);
    res.status(500).json({ error: "Error al eliminar logs" });
  }
};
