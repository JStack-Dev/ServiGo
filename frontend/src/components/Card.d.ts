import React from "react";
interface CardProps {
    title: string;
    description: string;
    children?: React.ReactNode;
}
declare const Card: React.FC<CardProps>;
export default Card;
