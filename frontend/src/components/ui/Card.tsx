import React from "react";

/* ============================================================
   🧱 Tipado de las props
   ============================================================ */
export interface CardProps {
  title?: string;          // ✅ Opcional
  description?: string;    // ✅ Opcional
  children?: React.ReactNode;
  className?: string;
}

/* ============================================================
   🧩 Componente principal Card
   ============================================================ */
export const Card: React.FC<CardProps> = ({
  title,
  description,
  children,
  className = "",
}) => {
  return (
    <div
      className={`bg-white dark:bg-gray-900 shadow-card rounded-2xl p-6 hover:shadow-lg transition ${className}`}
    >
      {title && (
        <h3 className="text-xl font-semibold text-primary mb-2">{title}</h3>
      )}
      {description && (
        <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      )}
      {children}
    </div>
  );
};

/* ============================================================
   🧩 Subcomponente CardContent
   ============================================================ */
export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return <div className={className}>{children}</div>;
};

export default Card;
