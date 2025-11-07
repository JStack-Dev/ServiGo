import { useEffect, useState } from "react";
import { getAllUsers, updateUser } from "@/api/admin";
import { Switch } from "@/components/ui/Switch";

/* ============================================================
   🧩 Tipado fuerte del modelo User
   ============================================================ */
interface User {
  _id: string;
  name: string;
  email: string;
  role: "client" | "professional" | "admin";
  isActive: boolean;
}

/* ============================================================
   📘 Tabla de usuarios – Panel Admin
   ============================================================ */
export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  /* ============================================================
     🔄 Cargar todos los usuarios
     ============================================================ */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        setUsers(res.data);
      } catch (error) {
        console.error("❌ Error al obtener usuarios:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  /* ============================================================
     ⚙️ Activar / desactivar usuario
     ============================================================ */
  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      setUpdating(id);
      await updateUser(id, { isActive: !isActive });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isActive: !isActive } : u))
      );
    } catch (error) {
      console.error("❌ Error actualizando usuario:", error);
    } finally {
      setUpdating(null);
    }
  };

  /* ============================================================
     🎨 Render
     ============================================================ */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Cargando usuarios...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow">
      <table className="w-full text-left">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="p-3">Nombre</th>
            <th className="p-3">Email</th>
            <th className="p-3">Rol</th>
            <th className="p-3 text-center">Activo</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr
              key={u._id}
              className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <td className="p-3">{u.name}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3 capitalize">{u.role}</td>
              <td className="p-3 text-center">
                <Switch
                  checked={u.isActive}
                  onCheckedChange={() => toggleActive(u._id, u.isActive)}
                />
                {updating === u._id && (
                  <span className="text-xs text-gray-400 ml-2">Guardando...</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
