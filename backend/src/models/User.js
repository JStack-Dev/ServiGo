// src/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// 🧩 Definición del esquema de usuario
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Email no válido"],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
    },
    role: {
      type: String,
      enum: ["cliente", "profesional", "admin"],
      default: "cliente",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // 🌍 Ubicación geoespacial para el modo urgencia
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitud, latitud]
        default: [0, 0],
      },
    },
    // 🟢 Estado de disponibilidad del profesional
    isAvailable: {
      type: Boolean,
      default: true, // true = disponible para urgencias
    },
    // ⭐ Gamificación y puntuaciones
    averageRating: {
      type: Number,
      default: 0, // Puntuación promedio (1-5)
    },
    completedServices: {
      type: Number,
      default: 0, // Cantidad de servicios completados
    },
    level: {
      type: String,
      enum: ["Bronce", "Plata", "Oro", "Diamante"],
      default: "Bronce",
    },
    badges: {
      type: [String],
      default: [], // Medallas obtenidas ("Top Valorado", "Constante", etc.)
    },
  },
  { timestamps: true } // ⏰ crea automáticamente createdAt y updatedAt
);

// 🧭 Índice geoespacial necesario para búsquedas por cercanía
userSchema.index({ location: "2dsphere" });

// 🔐 Middleware: encriptar la contraseña antes de guardar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 🧠 Método personalizado: comparar contraseñas al hacer login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Exportar el modelo
export default mongoose.model("User", userSchema);
