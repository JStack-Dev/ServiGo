import { useEffect, useState } from "react";
import { getAllBookings } from "@/api/admin"; // ✅ usa alias absoluto si lo tienes configurado

// ✅ Tipado fuerte del objeto Booking
interface Booking {
  _id: string;
  client?: { name: string };
  professional?: { name: string };
  status: string;
  totalPrice: number;
  createdAt: string;
}

export default function BookingsTable() {
  // ✅ Tipamos correctamente el estado
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // ✅ Tipamos la respuesta de la API
    getAllBookings().then((res: { data: Booking[] }) => {
      setBookings(res.data);
    });
  }, []);

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow">
      <table className="w-full text-left">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="p-3">Cliente</th>
            <th className="p-3">Profesional</th>
            <th className="p-3">Estado</th>
            <th className="p-3">Precio</th>
            <th className="p-3">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr
              key={b._id}
              className="border-t border-gray-200 dark:border-gray-700"
            >
              <td className="p-3">{b.client?.name ?? "—"}</td>
              <td className="p-3">{b.professional?.name ?? "—"}</td>
              <td className="p-3 capitalize">{b.status}</td>
              <td className="p-3">{b.totalPrice} €</td>
              <td className="p-3">
                {new Date(b.createdAt).toLocaleDateString("es-ES")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
