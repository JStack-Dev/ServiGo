import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 z-50 rounded-xl bg-primary text-white px-3 py-2 shadow-lg hover:opacity-90 focus:outline-none transition-all"
      aria-label="Cambiar tema"
      title="Cambiar tema"
    >
      {theme === "dark" ? "🌙 Modo Oscuro" : "☀️ Modo Claro"}
    </button>
  );
}
