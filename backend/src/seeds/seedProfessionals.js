// ============================================================
// 👷 seedProfessionals.js – Insertar profesionales de ejemplo
// ============================================================
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

const professionals = [
  {
    name: "Juan Pérez",
    email: "juanperez@servigo.com",
    password: "123456",
    role: "profesional",
    specialty: "Fontanero",
    phone: "611111111",
    rating: 4.8,
  },
  {
    name: "María López",
    email: "marialopez@servigo.com",
    password: "123456",
    role: "profesional",
    specialty: "Electricista",
    phone: "622222222",
    rating: 4.6,
  },
  {
    name: "Pedro García",
    email: "pedrogarcia@servigo.com",
    password: "123456",
    role: "profesional",
    specialty: "Carpintero",
    phone: "633333333",
    rating: 4.9,
  },
  {
    name: "Lucía Fernández",
    email: "luciafernandez@servigo.com",
    password: "123456",
    role: "profesional",
    specialty: "Pintor",
    phone: "644444444",
    rating: 4.7,
  },
  {
    name: "Carlos Romero",
    email: "carlosromero@servigo.com",
    password: "123456",
    role: "profesional",
    specialty: "Cerrajero",
    phone: "655555555",
    rating: 4.5,
  },
  {
    name: "Ana Torres",
    email: "anatorres@servigo.com",
    password: "123456",
    role: "profesional",
    specialty: "Jardinero",
    phone: "666666666",
    rating: 4.4,
  },
];

async function seedProfessionals() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    // Encriptar contraseñas antes de guardar
    const hashed = await Promise.all(
      professionals.map(async (pro) => ({
        ...pro,
        password: await bcrypt.hash(pro.password, 10),
      }))
    );

    await User.insertMany(hashed);
    console.log(`🌱 ${hashed.length} profesionales insertados correctamente.`);

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error insertando profesionales:", error);
    mongoose.connection.close();
  }
}

seedProfessionals();
