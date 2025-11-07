import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false },
    delivered: { type: Boolean, default: false },
  },
  { timestamps: true }
);

messageSchema.index({ serviceId: 1, createdAt: -1 });

export default mongoose.model("Message", messageSchema);
