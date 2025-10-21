import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { getUserProfile, updateUserProfile } from "@/services/user.service";
import { useAuth } from "@/context/authContext";

// ✅ Tipado del usuario
interface User {
  name?: string;
  email?: string;
  role?: string;
  level?: string;
  password?: string;
}

export default function Profile() {
  const { user, setUser, token } = useAuth();
  const [formData, setFormData] = useState<User>(user || {});
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Cargar perfil solo cuando haya token o el usuario cambie
  useEffect(() => {
    if (!user && token) {
      getUserProfile()
        .then((data) => setFormData(data.user))
        .catch((_error) => console.error("Error al obtener el perfil"));
    }
  }, [user, token]); // 🧩 Dependencias correctas

  // ✅ Tipado correcto del evento
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Tipado correcto del submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await updateUserProfile(formData);
      setUser(res.user);
      localStorage.setItem("user", JSON.stringify(res.user));
      setMessage("Perfil actualizado correctamente ✅");
      setEditing(false);
    } catch (_error) {
      setMessage("Error al actualizar el perfil ❌");
    }
  };

  if (!formData) return <p>Cargando...</p>;

  return (
    <section className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Mi Perfil
      </h2>

      {!editing ? (
        <>
          <div className="space-y-2">
            <p>
              <strong>Nombre:</strong> {formData.name || "—"}
            </p>
            <p>
              <strong>Email:</strong> {formData.email || "—"}
            </p>
            <p>
              <strong>Rol:</strong> {formData.role || "—"}
            </p>
            <p>
              <strong>Nivel:</strong> {formData.level || "—"}
            </p>
          </div>

          <button
            onClick={() => setEditing(true)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Editar Perfil
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            placeholder="Nombre"
          />
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            placeholder="Correo"
          />
          <input
            type="password"
            name="password"
            value={formData.password || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            placeholder="Nueva contraseña (opcional)"
          />

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      )}

      {message && (
        <p className="mt-4 text-center text-sm text-green-500">{message}</p>
      )}
    </section>
  );
}
