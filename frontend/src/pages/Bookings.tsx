"use client";
import { useEffect, useState, useCallback } from "react";
import { getBookings, cancelBooking, completeBooking } from "@/api/bookings";
import { useAuth } from "@/context/authContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
   🧩 Tipado fuerte de Booking
   ============================================================ */
interface Booking {
  _id: string;
  serviceId: string;
  professionalId: string;
  clientId: string;
  date: string;
  amount: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "paid" | "unpaid" | "refunded";
  stripeSessionId?: string;
  createdAt: string;
}

/* ============================================================
   📘 Página principal
   ============================================================ */
export default function Bookings() {
  const { token } = useAuth(); // 🧠 user eliminado (no se usa)
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  /* ============================================================
     📦 Carga de reservas — con useCallback para evitar warnings
     ============================================================ */
  const loadBookings = useCallback(async () => {
    if (!token) return; // Evita errores si no hay token
    try {
      const data = await getBookings(token);
      setBookings(data);
    } catch (error) {
      console.error("❌ Error cargando reservas:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]); // ✅ Dependencia añadida

  /* ============================================================
     ⚙️ Acción: completar o cancelar reserva
     ============================================================ */
  const handleAction = async (id: string, type: "complete" | "cancel") => {
    if (!token) return;
    try {
      setUpdating(id);
      if (type === "complete") {
        await completeBooking(id, token);
        toast.success("Reserva marcada como completada ✅");
      } else {
        await cancelBooking(id, token);
        toast.success("Reserva cancelada ❌");
      }
      await loadBookings(); // 🔁 recarga después de la acción
    } catch (error) {
      console.error("❌ Error al actualizar reserva:", error);
      toast.error("Error al actualizar reserva");
    } finally {
      setUpdating(null);
    }
  };

  /* ============================================================
     🎨 Render principal
     ============================================================ */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-600 via-cyan-400 to-green-300 text-white">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-600 via-cyan-400 to-green-300 p-8 text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">📅 Tus reservas</h1>

      {bookings.length === 0 ? (
        <p className="text-center text-white/80">
          No tienes reservas registradas.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {bookings.map((b) => (
              <motion.div
                key={b._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/15 backdrop-blur-lg rounded-2xl p-5 shadow-xl border border-white/10 hover:scale-[1.02] transition flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    Servicio #{b.serviceId}
                  </h2>
                  <p className="text-sm text-white/80 mb-2">
                    Fecha: {new Date(b.date).toLocaleString("es-ES")}
                  </p>
                  <p className="text-sm text-white/80 mb-2">
                    Monto: {b.amount.toFixed(2)} €
                  </p>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span
                    className={`text-sm font-medium flex items-center gap-1 ${
                      b.status === "confirmed"
                        ? "text-green-300"
                        : b.status === "pending"
                        ? "text-yellow-300"
                        : b.status === "cancelled"
                        ? "text-red-400"
                        : "text-blue-300"
                    }`}
                  >
                    {b.status === "confirmed" && <CheckCircle size={16} />}
                    {b.status === "pending" && <Clock size={16} />}
                    {b.status === "cancelled" && <XCircle size={16} />}
                    {b.status === "completed" && <RefreshCw size={16} />}
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </span>

                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      b.paymentStatus === "paid"
                        ? "bg-green-500/30 text-green-200"
                        : b.paymentStatus === "refunded"
                        ? "bg-red-500/30 text-red-200"
                        : "bg-yellow-500/30 text-yellow-100"
                    }`}
                  >
                    {b.paymentStatus.toUpperCase()}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-5">
                  {b.paymentStatus === "paid" && b.stripeSessionId && (
                    <a
                      href={`https://dashboard.stripe.com/test/payments/${b.stripeSessionId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm underline text-white/90 hover:text-white"
                    >
                      <ExternalLink size={14} /> Ver en Stripe
                    </a>
                  )}

                  <div className="flex gap-2">
                    {b.status === "confirmed" && (
                      <button
                        onClick={() => handleAction(b._id, "complete")}
                        disabled={updating === b._id}
                        className="px-3 py-1 bg-green-500/40 rounded-lg hover:bg-green-500/60 transition text-sm"
                      >
                        {updating === b._id ? "..." : "Completar"}
                      </button>
                    )}

                    {b.status === "pending" && (
                      <button
                        onClick={() => handleAction(b._id, "cancel")}
                        disabled={updating === b._id}
                        className="px-3 py-1 bg-red-500/40 rounded-lg hover:bg-red-500/60 transition text-sm"
                      >
                        {updating === b._id ? "..." : "Cancelar"}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
