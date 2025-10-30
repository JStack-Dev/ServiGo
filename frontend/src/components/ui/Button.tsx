import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className={`py-3 px-6 rounded-full font-semibold shadow-md 
        bg-primary text-white hover:bg-primary-dark 
        transition disabled:opacity-70 ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
};
