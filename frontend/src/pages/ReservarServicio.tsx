"use client";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";
import { Calendar, Clock, CreditCard } from "lucide-react";

interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  professional: {
    _id: string;
    name: string;
    email: string;
  };
}

export default function ReservarServicio() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // ===========================
  // 📦 Cargar datos del servicio
  // ===========================
  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/services/${serviceId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setService(res.data);
      } catch (err) {
        toast.error("Error al cargar el servicio");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchService();
  }, [serviceId, token]);

  // ===========================
  // 💳 Reservar + Stripe
  // ===========================
  const handleReserve = async () => {
    if (!service || !date) {
      toast.error("Selecciona una fecha antes de continuar");
      return;
    }

    try {
      setProcessing(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/payments/create-session`,
        {
          serviceId: service._id,
          professionalId: service.professional._id,
          date,
          amount: service.price,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Redirigiendo a Stripe...");
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Error en la reserva:", err);
      toast.error("No se pudo iniciar el pago.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-600 via-cyan-400 to-green-300">
        <p className="text-white/80 animate-pulse text-lg">
          Cargando servicio...
        </p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-red-600 via-orange-400 to-yellow-300">
        <p className="text-white/90 font-semibold">
          Servicio no encontrado 😢
        </p>
      </div>
    );
  }

  // ===========================
  // 🎨 UI
  // ===========================
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-600 via-cyan-400 to-green-300 p-6"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-3xl text-white">
        <h1 className="text-3xl font-bold mb-4">{service.title}</h1>
        <p className="text-white/80 mb-4">{service.description}</p>
        <p className="font-semibold text-lg mb-6">
          💰 Precio: {service.price.toFixed(2)} €
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Calendar className="text-white/80" size={20} />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-white/20 border border-white/30 rounded-xl px-3 py-2 text-white placeholder-white/60 focus:ring-2 focus:ring-cyan-400 outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <Clock className="text-white/80" size={20} />
            <p className="text-white/70 text-sm">
              Profesional: {service.professional.name}
            </p>
          </div>
        </div>

        <motion.button
          onClick={handleReserve}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={processing}
          className="mt-8 flex items-center justify-center gap-2 bg-gradient-to-br from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg w-full transition"
        >
          {processing ? (
            <span className="animate-pulse">Procesando...</span>
          ) : (
            <>
              <CreditCard size={18} />
              Reservar y Pagar
            </>
          )}
        </motion.button>

        <button
          onClick={() => navigate(-1)}
          className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg text-sm transition"
        >
          ← Volver atrás
        </button>
      </div>
    </motion.div>
  );
}
