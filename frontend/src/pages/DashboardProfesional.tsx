"use client";
import React from "react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  Clock,
  MessageCircle,
  Euro,
  CalendarDays,
  User,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/authContext";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

/* ============================================================
   🔹 Tipado fuerte
   ============================================================ */
interface Client {
  _id: string;
  name: string;
  email: string;
}

interface Booking {
  _id: string;
  serviceId: {
    _id: string;
    title: string;
    category: string;
  };
  clientId: Client;
  date: string;
  amount: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "refunded";
  createdAt: string;
}

/* ============================================================
   🧠 Dashboard Profesional
   ============================================================ */
export default function DashboardProfesional(): React.JSX.Element {
  const { token, user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [_socket, setSocket] = useState<Socket | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const navigate = useNavigate();

  /* ============================================================
     🚀 Cargar reservas del profesional
     ============================================================ */
  const fetchBookings = useCallback(async (): Promise<void> => {
    if (!token) return;
    try {
      const res = await axios.get<Booking[]>(
        `${import.meta.env.VITE_API_URL}/bookings`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings(res.data);
    } catch {
      console.error("❌ Error al cargar reservas");
      toast.error("Error al cargar tus reservas");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchBookings();
  }, [token, fetchBookings]);

  /* ============================================================
     🔌 Conexión Socket.IO — tiempo real
     ============================================================ */
  useEffect(() => {
    if (!user?._id || !token) return;

    const socketInstance = io(import.meta.env.VITE_API_URL || "http://localhost:4000", {
      auth: { token },
      transports: ["websocket"],
    });
    setSocket(socketInstance);

    socketInstance.on(
      "booking:updated",
      ({ professionalId, status }: { professionalId: string; status: string }) => {
        if (professionalId === user._id) {
          toast.info(`Una reserva ha sido ${status}`);
          fetchBookings();
        }
      }
    );

    socketInstance.on("booking:new", ({ professionalId }: { professionalId: string }) => {
      if (professionalId === user._id) {
        toast.success("🆕 Nueva reserva recibida");
        fetchBookings();
      }
    });

    return (): void => {
      socketInstance.disconnect();
    };
  }, [token, user?._id, fetchBookings]);

  /* ============================================================
     🧩 Acciones de reserva
     ============================================================ */
  const handleUpdateStatus = async (id: string, newStatus: string): Promise<void> => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/bookings/${id}/${newStatus}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Reserva ${newStatus} correctamente`);
      fetchBookings();
    } catch {
      toast.error("Error al actualizar el estado");
    }
  };

  /* ============================================================
     📊 Filtros visuales
     ============================================================ */
  const filterBookings = (status: string): Booking[] => {
    switch (status) {
      case "pending":
        return bookings.filter((b) => b.status === "pending");
      case "confirmed":
        return bookings.filter((b) => b.status === "confirmed");
      case "completed":
        return bookings.filter((b) => b.status === "completed");
      default:
        return bookings;
    }
  };

  /* ============================================================
     🎨 UI — Tarjetas
     ============================================================ */
  const renderBookings = (
    status: string,
    color: string,
    title: string,
    icon: React.ReactNode
  ): React.JSX.Element => {
    const filtered = filterBookings(status);

    return (
      <motion.div
        key={status}
        className={`bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 border-l-4 ${color}`}
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          {icon} {title} ({filtered.length})
        </h2>
        {filtered.length === 0 ? (
          <p className="text-white/70 text-sm">No hay reservas en este estado.</p>
        ) : (
          <ul className="space-y-4">
            {filtered.map((b) => (
              <motion.li key={b._id} className="bg-white/20 rounded-xl p-4 shadow-md" layout>
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setExpanded(expanded === b._id ? null : b._id)}
                >
                  <div>
                    <p className="font-semibold">{b.serviceId.title}</p>
                    <p className="text-sm text-white/70">
                      Cliente: {b.clientId.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
                      <Euro size={14} /> {b.amount.toFixed(2)}
                    </span>
                    {expanded === b._id ? (
                      <XCircle className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {expanded === b._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 border-t border-white/20 pt-3 text-sm text-white/90"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarDays size={16} />
                        {new Date(b.date).toLocaleDateString("es-ES")}
                      </div>
                      <p>
                        <strong>Pago:</strong>{" "}
                        <span
                          className={
                            b.paymentStatus === "paid"
                              ? "text-green-300 font-semibold"
                              : "text-yellow-300"
                          }
                        >
                          {b.paymentStatus.toUpperCase()}
                        </span>
                      </p>
                      <p>
                        <strong>Estado:</strong>{" "}
                        <span className="font-semibold">
                          {b.status.toUpperCase()}
                        </span>
                      </p>
                      <hr className="my-3 border-white/20" />
                      <h4 className="font-semibold flex items-center gap-1 mb-1">
                        <User size={16} /> Cliente
                      </h4>
                      <p>{b.clientId.name}</p>
                      <p className="text-white/70 text-sm">{b.clientId.email}</p>

                      <div className="flex flex-wrap justify-end gap-3 mt-4">
                        {b.status === "pending" && (
                          <button
                            onClick={() => handleUpdateStatus(b._id, "confirm")}
                            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white text-sm font-semibold transition"
                          >
                            Confirmar
                          </button>
                        )}
                        {b.status === "confirmed" && (
                          <button
                            onClick={() => handleUpdateStatus(b._id, "complete")}
                            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white text-sm font-semibold transition"
                          >
                            Marcar completado
                          </button>
                        )}
                        {b.status !== "completed" && (
                          <button
                            onClick={() => handleUpdateStatus(b._id, "cancel")}
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white text-sm font-semibold transition"
                          >
                            Cancelar
                          </button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            navigate(`/chat-profesional/${b.serviceId._id}`)
                          }
                          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow-md transition flex items-center gap-2"
                        >
                          <MessageCircle size={16} /> Chat
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>
    );
  };

  /* ============================================================
     🧭 Render principal
     ============================================================ */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-emerald-600 via-teal-500 to-cyan-400">
        <p className="text-white/80 animate-pulse text-lg">Cargando reservas...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex flex-col items-center bg-linear-to-br from-emerald-600 via-teal-500 to-cyan-400 p-8 text-white"
    >
      <div className="w-full max-w-6xl space-y-8">
        <h1 className="text-4xl font-bold text-center mb-4">
          👷 Panel del Profesional
        </h1>
        <p className="text-center text-white/80 mb-6">
          Gestiona tus reservas, confirma o completa trabajos y comunícate con los clientes.
        </p>

        {renderBookings("pending", "border-yellow-400", "Pendientes", <Clock />)}
        {renderBookings("confirmed", "border-blue-400", "Confirmadas", <ClipboardList />)}
        {renderBookings("completed", "border-green-400", "Completadas", <CheckCircle2 />)}
      </div>
    </motion.div>
  );
}
