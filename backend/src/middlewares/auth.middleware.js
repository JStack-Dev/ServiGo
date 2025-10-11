// 📁 src/middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ Verifica que el usuario tenga un token válido
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Acceso denegado. Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // guardamos id y rol del token
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token inválido o expirado" });
  }
};

// 🛡️ Middleware: permite solo administradores
export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    if (user.role !== "admin") return res.status(403).json({ error: "No tienes permisos de administrador" });
    next();
  } catch (error) {
    res.status(500).json({ error: "Error al verificar rol de administrador" });
  }
};

// ⚙️ Middleware genérico: verificar roles dinámicamente
export const checkRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({ error: "No tienes permisos para acceder a esta ruta" });
    }
    next();
  };
};
