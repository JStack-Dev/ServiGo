import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Algunos logs pueden generarse sin usuario (sistema)
    },
    role: {
      type: String,
      enum: ["cliente", "profesional", "admin", "sistema",  "system"],
      default: "sistema",
    },
    action: {
      type: String,
      required: true, // Ejemplo: "CREAR_SERVICIO", "ELIMINAR_USUARIO"
    },
    description: {
      type: String,
      required: true, // Detalle del evento
    },
    ip: String, // Dirección IP del usuario
    userAgent: String, // Navegador o cliente HTTP
  },
  { timestamps: true }
);

export default mongoose.model("Log", logSchema);
