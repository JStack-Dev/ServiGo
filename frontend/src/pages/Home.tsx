import Button from "../components/Button";
import Card from "../components/Card";
import Container from "../components/Container";
import { useTheme } from "@/context/ThemeContext";

const Home = () => {
  const { theme } = useTheme();

  return (
    <Container>
      <h1 className="text-4xl font-display text-primary mb-6">
        Bienvenido a ServiGo
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Card
          title="Electricidad"
          description="Profesionales certificados para instalaciones y reparaciones."
        >
          <Button variant="primary">Ver más</Button>
        </Card>

        <Card
          title="Fontanería"
          description="Reparaciones urgentes y mantenimiento de redes de agua."
        >
          <Button variant="secondary">Ver más</Button>
        </Card>

        <Card
          title="Limpieza"
          description="Servicio rápido, confiable y adaptado a tus horarios."
        >
          <Button variant="outline">Ver más</Button>
        </Card>
      </div>

      {/* 🧪 Prueba directa de Tailwind dark mode */}
      <div className="p-8 bg-white text-black dark:bg-neutral-dark dark:text-neutral-light rounded-xl shadow-card transition-colors duration-300">
        <h2 className="text-2xl font-bold mb-2">
          Modo actual: {theme === "dark" ? "🌙 Oscuro" : "☀️ Claro"}
        </h2>
        <p>
          Este bloque debería cambiar entre blanco (modo claro) y gris oscuro (modo oscuro)
          cuando pulses el botón del tema.
        </p>
      </div>
    </Container>
  );
};

export default Home;
