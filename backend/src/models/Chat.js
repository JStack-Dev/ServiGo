// ==============================
// 💬 Modelo Chat – Conversaciones entre usuarios
// ==============================
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

chatSchema.index({ participants: 1 });

// ✅ Evita duplicados (misma pareja de usuarios)
chatSchema.statics.findOrCreate = async function (clientId, professionalId) {
  let chat = await this.findOne({
    participants: { $all: [clientId, professionalId] },
  });
  if (!chat) {
    chat = await this.create({ participants: [clientId, professionalId] });
  }
  return chat;
};

export default mongoose.model("Chat", chatSchema);
