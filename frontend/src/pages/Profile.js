import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "@/services/user.service";
import { useAuth } from "@/context/authContext";
export default function Profile() {
    const { user, setUser, token } = useAuth();
    const [formData, setFormData] = useState(user || {});
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
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    // ✅ Tipado correcto del submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await updateUserProfile(formData);
            setUser(res.user);
            localStorage.setItem("user", JSON.stringify(res.user));
            setMessage("Perfil actualizado correctamente ✅");
            setEditing(false);
        }
        catch (_error) {
            setMessage("Error al actualizar el perfil ❌");
        }
    };
    if (!formData)
        return _jsx("p", { children: "Cargando..." });
    return (_jsxs("section", { className: "max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md", children: [_jsx("h2", { className: "text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100", children: "Mi Perfil" }), !editing ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("p", { children: [_jsx("strong", { children: "Nombre:" }), " ", formData.name || "—"] }), _jsxs("p", { children: [_jsx("strong", { children: "Email:" }), " ", formData.email || "—"] }), _jsxs("p", { children: [_jsx("strong", { children: "Rol:" }), " ", formData.role || "—"] }), _jsxs("p", { children: [_jsx("strong", { children: "Nivel:" }), " ", formData.level || "—"] })] }), _jsx("button", { onClick: () => setEditing(true), className: "mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition", children: "Editar Perfil" })] })) : (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx("input", { type: "text", name: "name", value: formData.name || "", onChange: handleChange, className: "w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700", placeholder: "Nombre" }), _jsx("input", { type: "email", name: "email", value: formData.email || "", onChange: handleChange, className: "w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700", placeholder: "Correo" }), _jsx("input", { type: "password", name: "password", value: formData.password || "", onChange: handleChange, className: "w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700", placeholder: "Nueva contrase\u00F1a (opcional)" }), _jsxs("div", { className: "flex justify-between", children: [_jsx("button", { type: "button", onClick: () => setEditing(false), className: "bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg", children: "Cancelar" }), _jsx("button", { type: "submit", className: "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg", children: "Guardar cambios" })] })] })), message && (_jsx("p", { className: "mt-4 text-center text-sm text-green-500", children: message }))] }));
}
