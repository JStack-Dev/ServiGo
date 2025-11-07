"use client";
import React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  User,
  MessageCircle,
  Euro,
  CalendarDays,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import axios from "axios";
import { toast } from "sonner";

/* =======================================
   🔹 Tipado fuerte y moderno
======================================= */
interface Professional {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

interface Booking {
  _id: string;
  serviceId?: {
    _id: string;
    title: string;
    category: string;
  };
  professionalId?: Professional;
  date: string;
  amount?: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "refunded";
  createdAt: string;
  address?: string;
  category?: string;
  imageUrl?: string;
}

/* =======================================
   💼 Dashboard del Cliente (Reservas + Incidencias IA)
======================================= */
export default function Dashboard(): React.JSX.Element {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState<
    "activos" | "pendientes" | "completados"
  >("activos");

  const [openBooking, setOpenBooking] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  /* =======================================
     🚀 Cargar reservas desde backend
  ======================================= */
  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) return;
      try {
        const res = await axios.get<Booking[]>(
          `${import.meta.env.VITE_API_URL}/bookings`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBookings(res.data);
      } catch (error) {
        console.error("❌ Error al cargar reservas:", error);
        toast.error("Error al cargar tus reservas");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [token]);

  /* =======================================
     🧠 Filtros por estado
  ======================================= */
  const filterBookings = (estado: "activos" | "pendientes" | "completados") => {
    switch (estado) {
      case "activos":
        return bookings.filter(
          (b) => b.status === "confirmed" || b.status === "pending"
        );
      case "pendientes":
        return bookings.filter((b) => b.status === "pending");
      case "completados":
        return bookings.filter((b) => b.status === "completed");
      default:
        return [];
    }
  };

  /* =======================================
     📋 Render de lista
  ======================================= */
  const renderList = (): React.JSX.Element => {
    const sectionData = filterBookings(activeSection);

    if (sectionData.length === 0) {
      return (
        <p className="text-center text-white/70 mt-6">
          No tienes reservas o incidencias en esta categoría.
        </p>
      );
    }

    return (
      <ul className="space-y-4 mt-6">
        {sectionData.map((b) => (
          <motion.li
            key={b._id}
            layout
            className="bg-white/20 backdrop-blur-md rounded-xl shadow-md overflow-hidden"
          >
            {/* 🔹 Cabecera */}
            <button
              onClick={() =>
                setOpenBooking(openBooking === b._id ? null : b._id)
              }
              className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
            >
              <div>
                <p className="font-semibold">
                  {b.serviceId?.title || "Incidencia reportada"}
                </p>
                <p className="text-sm text-white/70">
                  {b.serviceId?.category || b.category || "general"} · {b.status}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {b.amount !== undefined && (
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
                    <Euro size={14} /> {b.amount.toFixed(2)}
                  </span>
                )}
                {openBooking === b._id ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </button>

            {/* 🔽 Detalle */}
            <AnimatePresence>
              {openBooking === b._id && (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-4"
                >
                  <div className="border-t border-white/20 mt-2 pt-3 text-sm text-white/90">
                    {/* 📅 Fecha */}
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarDays size={16} />
                      <span>
                        Fecha:{" "}
                        {new Date(b.date).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {/* 💳 Estado de pago */}
                    <p>
                      <strong>Estado de pago:</strong>{" "}
                      <span
                        className={`font-semibold ${
                          b.paymentStatus === "paid"
                            ? "text-green-300"
                            : "text-yellow-300"
                        }`}
                      >
                        {b.paymentStatus.toUpperCase()}
                      </span>
                    </p>

                    {/* 📍 Dirección */}
                    {b.address && (
                      <p className="mt-1">
                        <strong>Dirección:</strong> {b.address}
                      </p>
                    )}

                    {/* 🧠 Categoría detectada por IA */}
                    {b.category && (
                      <p className="mt-1">
                        <strong>Categoría IA:</strong>{" "}
                        <span className="capitalize text-yellow-200">
                          {b.category}
                        </span>
                      </p>
                    )}

                    {/* 🖼️ Imagen adjunta */}
                    {b.imageUrl && (
                      <div className="mt-3">
                        <img
                          src={`${import.meta.env.VITE_API_URL}${b.imageUrl}`}
                          alt="Imagen de la incidencia"
                          className="rounded-lg border border-white/20 shadow-md max-h-48 object-cover"
                        />
                      </div>
                    )}

                    {/* 👨 Profesional asignado */}
                    {b.professionalId && (
                      <>
                        <hr className="my-3 border-white/20" />
                        <h4 className="font-semibold mb-1 flex items-center gap-1">
                          <User size={16} /> Profesional asignado
                        </h4>
                        <p>
                          <strong>Nombre:</strong> {b.professionalId.name}
                        </p>
                        <p>
                          <strong>Email:</strong> {b.professionalId.email}
                        </p>
                        {b.professionalId.phone && (
                          <p>
                            <strong>Teléfono:</strong> {b.professionalId.phone}
                          </p>
                        )}
                      </>
                    )}

                    {/* 🔹 Acciones */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                      {/* 💬 Chat directo */}
                      {b.professionalId && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(`/chat/${b.serviceId?._id}`)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-all flex items-center gap-2"
                        >
                          <MessageCircle size={18} /> Chat
                        </motion.button>
                      )}

                      {/* 🚫 Cancelar reserva */}
                      {b.status === "pending" && (
                        <button
                          onClick={async () => {
                            const confirmCancel = window.confirm(
                              "¿Seguro que deseas cancelar esta reserva?"
                            );
                            if (!confirmCancel) return;

                            await axios.patch(
                              `${import.meta.env.VITE_API_URL}/bookings/${b._id}/cancel`,
                              {},
                              { headers: { Authorization: `Bearer ${token}` } }
                            );
                            toast.success("Reserva cancelada correctamente");
                            setBookings((prev) =>
                              prev.map((res) =>
                                res._id === b._id
                                  ? { ...res, status: "cancelled" }
                                  : res
                              )
                            );
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition-all"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        ))}
      </ul>
    );
  };

  /* =======================================
     🎨 Render principal
  ======================================= */
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-start bg-linear-to-br from-blue-600 via-cyan-400 to-green-300 p-8 text-white"
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-4xl p-8">
        <h1 className="text-3xl font-bold mb-4 text-center">🧾 Mis Reservas</h1>
        <p className="text-center mb-8 text-white/90">
          Gestiona tus reservas, pagos y chats con los profesionales.
        </p>

        {/* 🔘 Pestañas */}
        <div className="grid md:grid-cols-3 gap-6">
          {(
            [
              { key: "activos", label: "Activos", icon: <Briefcase /> },
              { key: "pendientes", label: "Pendientes", icon: <Clock /> },
              { key: "completados", label: "Completados", icon: <CheckCircle2 /> },
            ] as const
          ).map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`p-5 rounded-xl flex flex-col items-center shadow-md transition-all duration-200 ${
                activeSection === key
                  ? "bg-linear-to-r from-blue-400 to-cyan-500 scale-105"
                  : "bg-white/20 hover:bg-white/30"
              }`}
            >
              <div className="w-10 h-10 mb-2">{icon}</div>
              <p className="font-semibold text-lg">{label}</p>
              <span className="text-2xl font-bold mt-1">
                {filterBookings(key).length}
              </span>
            </button>
          ))}
        </div>

        {/* 📋 Listado de reservas */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? (
              <p className="text-center text-white/70 mt-6">Cargando...</p>
            ) : (
              renderList()
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
