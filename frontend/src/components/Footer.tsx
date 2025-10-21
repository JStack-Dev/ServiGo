const Footer = () => {
  return (
    <footer className="bg-neutral-dark text-neutral-light py-4 text-center">
      <p className="text-sm">
        © {new Date().getFullYear()} <span className="text-secondary font-semibold">ServiGo</span> — Todos los derechos reservados.
      </p>
    </footer>
  );
};

export default Footer;
