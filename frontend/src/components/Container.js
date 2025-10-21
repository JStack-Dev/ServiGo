import { jsx as _jsx } from "react/jsx-runtime";
const Container = ({ children, className }) => {
    return (_jsx("div", { className: `max-w-6xl mx-auto px-4 ${className || ""}`, children: children }));
};
export default Container;
