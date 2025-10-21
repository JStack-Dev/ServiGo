import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
const Login = () => {
    const navigate = useNavigate();
    const { login, loading, error } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate("/dashboard");
        }
        catch (err) {
            console.error("Error al iniciar sesión:", err);
        }
    };
    return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-neutral-light dark:bg-neutral-dark transition-colors", children: _jsxs("form", { onSubmit: handleSubmit, className: "bg-white dark:bg-gray-800 shadow-card p-8 rounded-2xl w-full max-w-md", children: [_jsx("h2", { className: "text-2xl font-semibold mb-6 text-center text-primary dark:text-secondary", children: "Iniciar sesi\u00F3n" }), error && (_jsx("div", { className: "text-red-500 text-center text-sm mb-4", children: error })), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block mb-1 font-medium text-gray-700 dark:text-gray-200", children: "Email" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary", required: true })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block mb-1 font-medium text-gray-700 dark:text-gray-200", children: "Contrase\u00F1a" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary", required: true })] }), _jsx("button", { type: "submit", disabled: loading, className: `w-full py-2 rounded-lg text-white font-semibold transition ${loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-primary hover:bg-blue-700"}`, children: loading ? "Cargando..." : "Entrar" })] }) }));
};
export default Login;
