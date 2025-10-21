import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Footer = () => {
    return (_jsx("footer", { className: "bg-neutral-dark text-neutral-light py-4 text-center", children: _jsxs("p", { className: "text-sm", children: ["\u00A9 ", new Date().getFullYear(), " ", _jsx("span", { className: "text-secondary font-semibold", children: "ServiGo" }), " \u2014 Todos los derechos reservados."] }) }));
};
export default Footer;
