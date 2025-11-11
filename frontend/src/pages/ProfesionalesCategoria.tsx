"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProfessionals, Professional } from "@/services/user.service";

export default function ProfesionalesCategoria() {
  const { category } = useParams<{ category: string }>();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        if (category) {
          const data = await getProfessionals(category);
          setProfessionals(data);
        }
      } catch (error) {
        console.error("❌ Error al cargar profesionales:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfessionals();
  }, [category]);

  if (loading) return <p className="p-8 text-center">Cargando profesionales...</p>;

  return (
    <div className="p-8 mt-16">
      <h1 className="text-2xl font-bold mb-6">
        Profesionales de {category}
      </h1>

      {professionals.length === 0 ? (
        <p>No hay profesionales registrados en esta categoría aún.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professionals.map((pro) => (
            <li
              key={pro._id}
              className="p-4 border rounded-xl shadow hover:shadow-lg transition-all"
            >
              <h2 className="text-lg font-semibold">{pro.name}</h2>
              <p className="text-gray-500">{pro.specialty}</p>
              <p className="text-sm text-gray-400">
                {pro.email}
              </p>
              <p className="mt-2 text-yellow-500">
                ⭐ {pro.averageRating.toFixed(1)} / 5
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
