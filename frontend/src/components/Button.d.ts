import React from "react";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline";
}
declare const Button: React.FC<ButtonProps>;
export default Button;
