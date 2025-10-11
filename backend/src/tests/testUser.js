import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Conectado para test de usuario");

    const nuevoUsuario = new User({
      name: "Jorge Moscoso",
      email: "jorge@example.com",
      password: "123456",
      role: "cliente",
    });

    await nuevoUsuario.save();
    console.log("🙌 Usuario creado con éxito:", nuevoUsuario);
    mongoose.connection.close();
  })
  .catch(err => console.error("❌ Error al probar el modelo:", err));
