// src/middlewares/sanitize.middleware.js
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import validator from "validator";

/**
 * 🛡️ Middleware global para sanitizar entradas y proteger contra inyecciones
 * - Limpia inputs maliciosos
 * - Elimina operadores Mongo peligrosos
 * - Previene ataques XSS
 */
export const applySanitization = (app) => {
  // 🧽 Limpia consultas y cuerpos de peticiones con caracteres peligrosos
  app.use(mongoSanitize());
  app.use(xss());
};

/**
 * ✅ Funciones de validación específicas (reutilizables en controladores)
 */
export const validateEmail = (email) => validator.isEmail(email);
export const validatePassword = (password) =>
  validator.isLength(password, { min: 6, max: 64 });
export const validateURL = (url) => validator.isURL(url);
