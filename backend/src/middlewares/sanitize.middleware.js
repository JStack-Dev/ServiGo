// ==============================
// 🧹 sanitize.middleware.js (Express 5 compatible)
// ==============================
import sanitize from "mongo-sanitize";

/**
 * Middleware de sanitización compatible con Express 5.
 * Limpia req.body, req.params y req.query sin reasignar propiedades inmutables.
 */
export const sanitizeMiddleware = (req, res, next) => {
  try {
    // Sanitizar req.body
    if (req.body && typeof req.body === "object") {
      for (const key in req.body) {
        req.body[key] = sanitize(req.body[key]);
      }
    }

    // Sanitizar req.params
    if (req.params && typeof req.params === "object") {
      for (const key in req.params) {
        req.params[key] = sanitize(req.params[key]);
      }
    }

    // Sanitizar req.query (sin modificar el objeto original)
    if (req.query && typeof req.query === "object") {
      const cleanQuery = {};
      for (const key in req.query) {
        cleanQuery[key] = sanitize(req.query[key]);
      }
      // Guardamos la versión segura en una propiedad aparte
      req.safeQuery = cleanQuery;
    }

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
