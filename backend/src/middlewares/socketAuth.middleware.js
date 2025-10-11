import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifySocketToken = (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      console.log("❌ Conexión sin token");
      return next(new Error("Token requerido"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // Añadimos los datos del usuario al socket
    next();
  } catch (error) {
    console.error("❌ Error en autenticación Socket:", error.message);
    next(new Error("Token inválido o expirado"));
  }
};
