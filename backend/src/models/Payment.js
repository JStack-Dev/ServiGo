import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    professional: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "eur" },
    status: { type: String, enum: ["pending", "succeeded", "failed"], default: "pending" },
    stripeSessionId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
