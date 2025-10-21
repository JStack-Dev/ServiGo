import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Card = ({ title, description, children }) => {
    return (_jsxs("div", { className: "bg-white shadow-card rounded-2xl p-6 hover:shadow-lg transition", children: [_jsx("h3", { className: "text-xl font-display text-primary mb-2", children: title }), _jsx("p", { className: "text-neutral-dark mb-4", children: description }), children] }));
};
export default Card;
