// src/modules/admin/admin.middleware.js
import jwt from "jsonwebtoken";
import User from "../../models/User.js";



export const verifyAdminRole = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Acceso denegado: solo administradores" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error en verifyAdminRole:", error);
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};
