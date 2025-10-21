const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-neutral-dark text-center py-4 mt-auto">
      <p className="text-sm text-gray-600 dark:text-gray-300">
        © {new Date().getFullYear()} ServiGo. Todos los derechos reservados.
      </p>
    </footer>
  );
};

export default Footer;
