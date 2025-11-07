import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  clientId: string;
  professionalId: string;
  serviceId: string;
  date: Date;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  amount: number;
  paymentStatus: "unpaid" | "paid" | "refunded";
  stripeSessionId?: string;
}

const BookingSchema = new Schema<IBooking>(
  {
    clientId: { type: String, required: true },
    professionalId: { type: String, required: true },
    serviceId: { type: String, required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    amount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    stripeSessionId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>("Booking", BookingSchema);
