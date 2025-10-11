import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El título del servicio es obligatorio"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["electricidad", "fontanería", "cerrajería", "carpintería", "otros"],
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pendiente", "en_proceso", "completado", "cancelado"],
      default: "pendiente",
    },
    urgency: {
      type: Boolean,
      default: false, // true = modo urgencia
    },
    // Relación con el profesional que crea el servicio
    professional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Relación con el cliente que lo solicita
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    // Profesional que acepta la urgencia (puede ser distinto del creador)
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    // Fecha y hora de aceptación
    acceptedAt: {
      type: Date,
      default: null,
    },
    // Fecha estimada o programada del servicio
    scheduledDate: {
      type: Date,
      default: null,
    },
    recurring: {
  type: Boolean,
  default: false, // Indica si el servicio es periódico
},
recurrenceInterval: {
  type: String,
  enum: ["diario", "semanal", "mensual", null],
  default: null, // Frecuencia de repetición
},

  },
  { timestamps: true } // crea createdAt y updatedAt automáticos
);

export default mongoose.model("Service", serviceSchema);
