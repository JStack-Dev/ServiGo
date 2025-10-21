import { jsx as _jsx } from "react/jsx-runtime";
import clsx from "clsx";
const Button = ({ children, variant = "primary", className, ...props }) => {
    const baseStyles = "px-5 py-2 rounded-xl font-semibold transition-colors duration-200";
    const variantStyles = {
        primary: "bg-primary text-white hover:bg-primary-dark",
        secondary: "bg-secondary text-white hover:bg-secondary-dark",
        outline: "border border-primary text-primary hover:bg-primary hover:text-white",
    };
    return (_jsx("button", { ...props, className: clsx(baseStyles, variantStyles[variant], className), children: children }));
};
export default Button;
