"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";
import { Loader2, Send, Image as ImageIcon } from "lucide-react";
import axios from "axios";

/* ============================================================
   🧠 Tipado fuerte
============================================================ */
interface IncidentForm {
  description: string;
  date?: string;
  address?: string;
  notes?: string;
  image?: File | null;
}

interface BookingResponse {
  success: boolean;
  message: string;
  categoryDetected?: string;
  professional?: {
    id: string;
    name: string;
    email: string;
    specialty: string;
  };
}

/* ============================================================
   🚀 Componente principal — Reportar incidencia
============================================================ */
export default function ReportarIncidencia() {
  const { token } = useAuth();
  const [form, setForm] = useState<IncidentForm>({
    description: "",
    date: "",
    address: "",
    notes: "",
    image: null,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ============================================================
     📸 Manejar imagen seleccionada
  ============================================================ */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Solo se permiten archivos de imagen (jpg, png, etc.)");
        return;
      }
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  /* ============================================================
     📩 Envío del formulario
  ============================================================ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.description.trim()) {
      toast.error("Por favor, describe la incidencia.");
      return;
    }

    if (!form.address?.trim()) {
      toast.error("Por favor, indica la dirección del servicio.");
      return;
    }

    if (!token) {
      toast.error("Debes iniciar sesión para reportar una incidencia.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("description", form.description);
      formData.append("date", form.date ?? "");
      formData.append("address", form.address ?? "");
      formData.append("notes", form.notes ?? "");
      if (form.image) formData.append("image", form.image);

      // ✅ URL corregida (sin repetir /api)
      const { data } = await axios.post<BookingResponse>(
        `${import.meta.env.VITE_API_URL}/bookings/ai`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success(`Reserva creada correctamente (${data.categoryDetected})`);
        setForm({
          description: "",
          date: "",
          address: "",
          notes: "",
          image: null,
        });
        setPreview(null);
      } else {
        toast.error(data.message || "Error al crear la reserva.");
      }
    } catch (error) {
      console.error("❌ Error al enviar incidencia:", error);
      toast.error("Error al enviar la incidencia. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     🎨 Renderizado
  ============================================================ */
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-600 via-cyan-400 to-green-300 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/15 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-lg border border-white/10 text-white"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          🧾 Reportar incidencia
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Descripción */}
          <div>
            <label className="block mb-2 font-medium">Descripción</label>
            <textarea
              name="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Ejemplo: Hay una fuga de agua debajo del fregadero..."
            />
          </div>

          {/* Fecha preferida */}
          <div>
            <label className="block mb-2 font-medium">Fecha preferida</label>
            <input
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>

          {/* Dirección */}
          <div>
            <label className="block mb-2 font-medium">Indica dirección</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Ejemplo: Calle San Ignacio 12, Ubrique (Cádiz)"
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>

          {/* Imagen */}
          <div>
            <label className="flex mb-2 font-medium items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Subir imagen (opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 text-sm bg-white/10 border border-white/20 rounded-xl text-white cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/30 file:text-white hover:file:bg-white/40"
            />
            {preview && (
              <div className="mt-3">
                <img
                  src={preview}
                  alt="Vista previa"
                  className="rounded-xl border border-white/20 max-h-48 object-cover mx-auto"
                />
              </div>
            )}
          </div>

          {/* Notas opcionales */}
          <div>
            <label className="block mb-2 font-medium">Notas adicionales</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Detalles adicionales, horarios, etc."
            />
          </div>

          {/* Botón enviar */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="w-full py-3 mt-2 bg-white/90 text-blue-700 font-semibold rounded-xl shadow-md hover:bg-white transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" /> Enviando...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" /> Enviar incidencia
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
