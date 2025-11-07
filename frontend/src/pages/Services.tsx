"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { MessageCircle, User } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";

/* =======================================================
   👨‍🔧 Página de Profesionales — Filtrada por categoría
======================================================= */

interface Professional {
  _id: string;
  name: string;
  email: string;
  specialty: string;
  phone?: string;
  rating?: number;
}

export default function Services() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>("");

  /* =======================================================
     🧭 Obtener categoría del query param (?category=fontanero)
  ======================================================= */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category");
    setCategory(cat ? decodeURIComponent(cat) : "");
  }, [location.search]);

  /* =======================================================
     📡 Cargar profesionales del backend
  ======================================================= */
  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users?role=profesional${
            category ? `&specialty=${category}` : ""
          }`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (Array.isArray(data)) {
          setProfessionals(data);
        } else if (data?.users) {
          setProfessionals(data.users);
        } else {
          setProfessionals([]);
        }
      } catch (error) {
        console.error("❌ Error al cargar profesionales:", error);
        toast.error("No se pudieron cargar los profesionales.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfessionals();
  }, [token, category]);

  /* =======================================================
     💬 Crear o abrir chat directo
  ======================================================= */
  const handleContact = async (professionalId: string) => {
    if (!token) {
      toast.error("Debes iniciar sesión para contactar a un profesional.");
      return navigate("/login");
    }

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/direct-chats`,
        { professionalId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data?.success && data.chatId) {
        toast.success("Conectando con el profesional...");
        navigate(`/chat-direct/${data.chatId}`); // ✅ ruta correcta
      } else {
        toast.error("No se pudo iniciar el chat.");
      }
    } catch (error) {
      console.error("❌ Error al crear chat:", error);
      toast.error("Error al contactar con el profesional.");
    }
  };

  /* =======================================================
     🎨 Renderizado UI
  ======================================================= */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-600 via-cyan-400 to-green-300 text-white p-6 flex flex-col items-center"
    >
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-2 text-center">
          👷 Profesionales {category && `de ${category}`}
        </h1>
        <p className="text-white/80 mb-8 text-center">
          Encuentra profesionales verificados y listos para ayudarte
        </p>

        {loading ? (
          <p className="text-white/80 text-center mt-20">Cargando...</p>
        ) : professionals.length === 0 ? (
          <p className="text-white/80 text-center">
            No hay profesionales registrados en esta categoría.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {professionals.map((pro) => (
                <motion.div
                  key={pro._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-lg flex flex-col justify-between border border-white/10"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold">{pro.name}</h2>
                      <p className="text-white/80 text-sm">{pro.specialty}</p>
                    </div>
                  </div>

                  <p className="text-white/80 text-sm mb-4">
                    <strong>Email:</strong> {pro.email}
                  </p>
                  {pro.phone && (
                    <p className="text-white/80 text-sm mb-4">
                      <strong>Teléfono:</strong> {pro.phone}
                    </p>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleContact(pro._id)}
                    className="mt-4 flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-blue-50 transition"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Contactar
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
