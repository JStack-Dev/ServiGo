import { useEffect, useState } from "react";
import { getAllServices, deleteService } from "./api/admin";
import { Trash2 } from "lucide-react";

/* ============================================================
   🧠 Tipado fuerte para los servicios
============================================================ */
interface Service {
  _id: string;
  title: string;
  category: string;
  price: number;
  status: string;
}

/* ============================================================
   🧩 Tabla de servicios — Panel Admin
============================================================ */
export default function ServicesTable() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async (): Promise<void> => {
      try {
        const res = await getAllServices();
        setServices(res.data as Service[]);
      } catch (error) {
        console.error("❌ Error al cargar servicios:", error);
      }
    };
    fetchServices();
  }, []);

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await deleteService(id);
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      console.error("❌ Error al eliminar servicio:", error);
    }
  };

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow">
      <table className="w-full text-left">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="p-3">Título</th>
            <th className="p-3">Categoría</th>
            <th className="p-3">Precio</th>
            <th className="p-3">Estado</th>
            <th className="p-3 text-center">Acción</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr
              key={s._id}
              className="border-t border-gray-200 dark:border-gray-700"
            >
              <td className="p-3">{s.title}</td>
              <td className="p-3">{s.category}</td>
              <td className="p-3">{s.price.toFixed(2)} €</td>
              <td className="p-3 capitalize">{s.status}</td>
              <td className="p-3 text-center">
                <button
                  onClick={() => handleDelete(s._id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
