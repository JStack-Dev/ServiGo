// ==============================
// 📅 Modelo Booking — Reservas de servicios ServiGo
// ==============================
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    professionalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    stripeSessionId: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// 🔎 Índices para rendimiento en consultas
bookingSchema.index({ clientId: 1 });
bookingSchema.index({ professionalId: 1 });
bookingSchema.index({ serviceId: 1 });
bookingSchema.index({ status: 1 });

export default mongoose.model("Booking", bookingSchema);
