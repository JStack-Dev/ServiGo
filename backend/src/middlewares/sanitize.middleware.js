// ==============================
// 🧹 sanitize.middleware.js
// ==============================
import sanitize from "mongo-sanitize";

/**
 * Middleware personalizado compatible con Express 5.
 * Limpia req.body, req.params y req.query sin modificar referencias internas.
 */
export const sanitizeMiddleware = (req, res, next) => {
  try {
    // Sanitiza los distintos objetos del request
    if (req.body) req.body = sanitize(req.body);
    if (req.params) req.params = sanitize(req.params);
    if (req.query) req.query = sanitize(req.query);
    next();
  } catch (error) {
    console.error("❌ Error en sanitización:", error.message);
    next();
  }
};

/**
 * ✅ Validadores de input seguros
 * Usados en auth.controller.js para prevenir correos o contraseñas inválidas.
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validatePassword = (password) => {
  // Mínimo 8 caracteres, una mayúscula, una minúscula y un número
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};
