"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

interface ImageViewerProps {
  images: string[]; // todas las imágenes del chat
  initialIndex: number; // posición de la imagen abierta
  onClose: () => void;
}

export default function ImageViewer({
  images,
  initialIndex,
  onClose,
}: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const src = images[currentIndex];

  /* =======================================
     ➡️ Ir a siguiente / anterior
  ======================================= */
  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images]);

  /* =======================================
     ⌨️ Cerrar o navegar con teclado
  ======================================= */
  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };

    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [onClose, prevImage, nextImage]);

  /* =======================================
     📱 Swipe móvil
  ======================================= */
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) =>
    setTouchStart(e.touches[0].clientX);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.touches[0].clientX;
    if (diff > 50) {
      nextImage();
      setTouchStart(null);
    } else if (diff < -50) {
      prevImage();
      setTouchStart(null);
    }
  };

  /* =======================================
     🎨 Renderizado
  ======================================= */
  return (
    <AnimatePresence>
      {src && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-9999 bg-black/80 backdrop-blur-sm flex items-center justify-center"
        >
          {/* Imagen */}
          <motion.img
            key={src}
            src={src}
            alt="Vista ampliada"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            className="max-w-[90%] max-h-[85vh] rounded-2xl shadow-2xl border border-white/10 object-contain"
          />

          {/* Botones de navegación */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-6 text-white/80 hover:text-white p-3 bg-white/10 hover:bg-white/20 rounded-full transition"
              >
                <ChevronLeft size={28} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-6 text-white/80 hover:text-white p-3 bg-white/10 hover:bg-white/20 rounded-full transition"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          {/* Cerrar */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full shadow"
          >
            <X size={20} />
          </button>

          {/* Indicador */}
          <p className="absolute bottom-6 text-white/70 text-sm">
            {currentIndex + 1} / {images.length}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
