"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useAuth } from "@/context/authContext";
import { Briefcase, Loader2 } from "lucide-react";

interface Offer {
  _id: string;
  title: string;
  description: string;
  category: string;
  client?: { name: string; email: string };
  createdAt: string;
}

export default function OffersIncoming() {
  const { token } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/services/offers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOffers(res.data);
      } catch (error) {
        console.error("❌ Error al obtener ofertas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, [token]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-20 text-gray-200">
        <Loader2 className="animate-spin mr-2" /> Cargando ofertas...
      </div>
    );

  if (offers.length === 0)
    return <p className="text-center text-gray-300 mt-10">No hay ofertas disponibles en este momento.</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {offers.map((offer) => (
        <motion.div
          key={offer._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-white/20 shadow-md"
        >
          <div className="flex items-center gap-2 mb-2">
            <Briefcase size={22} className="text-yellow-300" />
            <h3 className="text-lg font-semibold">{offer.title}</h3>
          </div>
          <p className="text-sm text-gray-200 mb-2">{offer.description}</p>
          <p className="text-xs text-gray-400">Categoría: {offer.category}</p>
          <p className="text-xs text-gray-500">
            Publicado: {new Date(offer.createdAt).toLocaleDateString()}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
