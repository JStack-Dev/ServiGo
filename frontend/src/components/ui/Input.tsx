import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div className="flex flex-col text-left w-full">
      {label && <label className="mb-1 text-sm text-gray-600">{label}</label>}
      <input
        {...props}
        className={`p-3 rounded-full border border-gray-300 dark:border-neutral-600 
          bg-gray-50 dark:bg-neutral-700 text-gray-800 dark:text-gray-100 
          focus:ring-2 focus:ring-primary outline-none transition`}
      />
    </div>
  );
};
