import React from "react";

interface CardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, description, children }) => {
  return (
    <div className="bg-white shadow-card rounded-2xl p-6 hover:shadow-lg transition">
      <h3 className="text-xl font-display text-primary mb-2">{title}</h3>
      <p className="text-neutral-dark mb-4">{description}</p>
      {children}
    </div>
  );
};

export default Card;
