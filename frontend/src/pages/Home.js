import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Button from "../components/Button";
import Card from "../components/Card";
import Container from "../components/Container";
import { useTheme } from "@/context/ThemeContext";
const Home = () => {
    const { theme } = useTheme();
    return (_jsxs(Container, { children: [_jsx("h1", { className: "text-4xl font-display text-primary mb-6", children: "Bienvenido a ServiGo" }), _jsxs("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10", children: [_jsx(Card, { title: "Electricidad", description: "Profesionales certificados para instalaciones y reparaciones.", children: _jsx(Button, { variant: "primary", children: "Ver m\u00E1s" }) }), _jsx(Card, { title: "Fontaner\u00EDa", description: "Reparaciones urgentes y mantenimiento de redes de agua.", children: _jsx(Button, { variant: "secondary", children: "Ver m\u00E1s" }) }), _jsx(Card, { title: "Limpieza", description: "Servicio r\u00E1pido, confiable y adaptado a tus horarios.", children: _jsx(Button, { variant: "outline", children: "Ver m\u00E1s" }) })] }), _jsxs("div", { className: "p-8 bg-white text-black dark:bg-neutral-dark dark:text-neutral-light rounded-xl shadow-card transition-colors duration-300", children: [_jsxs("h2", { className: "text-2xl font-bold mb-2", children: ["Modo actual: ", theme === "dark" ? "🌙 Oscuro" : "☀️ Claro"] }), _jsx("p", { children: "Este bloque deber\u00EDa cambiar entre blanco (modo claro) y gris oscuro (modo oscuro) cuando pulses el bot\u00F3n del tema." })] })] }));
};
export default Home;
