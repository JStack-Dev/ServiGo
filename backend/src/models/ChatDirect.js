// =======================================
// 💬 ChatDirect Model — ServiGo
// Chat directo entre cliente y profesional
// =======================================

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const chatDirectSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    professional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

// ✅ Evitar duplicados entre las mismas dos personas
chatDirectSchema.index({ client: 1, professional: 1 }, { unique: true });

// ✅ Método estático: crear o recuperar chat directo
chatDirectSchema.statics.findOrCreate = async function (clientId, professionalId) {
  let chat = await this.findOne({ client: clientId, professional: professionalId });
  if (!chat) {
    chat = await this.create({ client: clientId, professional: professionalId, messages: [] });
  }
  return chat;
};

export default mongoose.model("ChatDirect", chatDirectSchema);
