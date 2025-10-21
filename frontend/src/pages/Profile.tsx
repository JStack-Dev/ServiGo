import { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "@/services/user.service";
import { useAuth } from "@/context/authContext";

export default function Profile() {
  const { user, setUser, token } = useAuth() as any;
  const [formData, setFormData] = useState(user || {});
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user && token) {
      getUserProfile().then((data) => setFormData(data.user));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await updateUserProfile(formData);
      setUser(res.user);
      localStorage.setItem("user", JSON.stringify(res.user));
      setMessage("Perfil actualizado correctamente ✅");
      setEditing(false);
    } catch (error) {
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
            <p><strong>Nombre:</strong> {formData.name}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Rol:</strong> {formData.role}</p>
            <p><strong>Nivel:</strong> {formData.level}</p>
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
