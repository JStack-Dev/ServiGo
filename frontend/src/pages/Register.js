import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
const Register = () => {
    const navigate = useNavigate();
    const { register, loading, error } = useAuth();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }
        try {
            await register(form.name, form.email, form.password);
            navigate("/dashboard");
        }
        catch (err) {
            console.error("Error en el registro:", err);
        }
    };
    return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-neutral-light dark:bg-neutral-dark transition-colors", children: _jsxs("form", { onSubmit: handleSubmit, className: "bg-white dark:bg-gray-800 shadow-card p-8 rounded-2xl w-full max-w-md", children: [_jsx("h2", { className: "text-2xl font-semibold mb-6 text-center text-primary dark:text-secondary", children: "Crear cuenta" }), error && (_jsx("div", { className: "text-red-500 text-center text-sm mb-4", children: error })), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block mb-1 font-medium text-gray-700 dark:text-gray-200", children: "Nombre completo" }), _jsx("input", { type: "text", name: "name", value: form.name, onChange: handleChange, className: "w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary", required: true })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block mb-1 font-medium text-gray-700 dark:text-gray-200", children: "Email" }), _jsx("input", { type: "email", name: "email", value: form.email, onChange: handleChange, className: "w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary", required: true })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block mb-1 font-medium text-gray-700 dark:text-gray-200", children: "Contrase\u00F1a" }), _jsx("input", { type: "password", name: "password", value: form.password, onChange: handleChange, className: "w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary", required: true })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block mb-1 font-medium text-gray-700 dark:text-gray-200", children: "Confirmar contrase\u00F1a" }), _jsx("input", { type: "password", name: "confirmPassword", value: form.confirmPassword, onChange: handleChange, className: "w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary", required: true })] }), _jsx("button", { type: "submit", disabled: loading, className: `w-full py-2 rounded-lg text-white font-semibold transition ${loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-primary hover:bg-blue-700"}`, children: loading ? "Creando cuenta..." : "Registrarse" })] }) }));
};
export default Register;
