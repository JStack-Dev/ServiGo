import { type ReactNode } from "react";
type Theme = "light" | "dark";
interface ThemeContextProps {
    theme: Theme;
    toggleTheme: () => void;
}
export declare function ThemeProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useTheme(): ThemeContextProps;
export {};
