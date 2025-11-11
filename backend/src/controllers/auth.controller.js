// ===============================
// 🔐 Controlador de Autenticación
// ===============================

import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createLog } from "../utils/logger.js";
import {
  validateEmail,
  validatePassword,
} from "../middlewares/sanitize.middleware.js";

/* =====================================
 🔑 Generar token JWT
===================================== */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // Validez de 7 días
  );
};

/* =====================================
 🧩 Registro de usuario
===================================== */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, specialty } = req.body;
    console.log("🧩 BODY RECIBIDO:", req.body);

    // ✅ Validaciones básicas
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Correo no válido" });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        error:
          "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.",
      });
    }

    const allowedRoles = ["cliente", "profesional", "admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ error: `Rol no permitido: ${role}` });
    }

    // 📬 Comprobar duplicado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    // 🧰 Crear nuevo usuario con profesión si aplica
    const newUser = new User({
      name,
      email,
      password,
      role,
      specialty:
        role === "profesional"
          ? specialty?.trim() || "General"
          : undefined, // 👈 solo profesionales
    });

    await newUser.save();

    const token = generateToken(newUser);
    const { password: _, ...userData } = newUser.toObject();

    // 🧾 Log del registro
    try {
      await createLog({
        user: newUser._id,
        role: newUser.role,
        action: "REGISTRO",
        description: `Nuevo usuario registrado: ${newUser.email}`,
        req,
      });
    } catch (logErr) {
      console.warn("⚠️ No se pudo registrar el log de creación:", logErr);
    }

    // ✅ Respuesta exitosa
    res.status(201).json({
      message: "Usuario registrado correctamente 🚀",
      user: userData,
      token,
    });
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    res.status(500).json({
      error: error.message || "Error en el servidor",
    });
  }
};

/* =====================================
 🧩 Login de usuario
===================================== */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email y contraseña son obligatorios" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Correo no válido" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = generateToken(user);
    const { password: _, ...userData } = user.toObject();

    // 🧾 Log del login
    try {
      await createLog({
        user: user._id,
        role: user.role,
        action: "LOGIN",
        description: `Inicio de sesión correcto para ${user.email}`,
        req,
      });
    } catch (logErr) {
      console.warn("⚠️ No se pudo registrar el log de login:", logErr);
    }

    res.status(200).json({
      message: "Login exitoso ✅",
      user: userData,
      token,
    });
  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error);
    res.status(500).json({
      error: error.message || "Error en el servidor",
    });
  }
};
