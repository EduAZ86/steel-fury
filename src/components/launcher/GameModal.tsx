"use client";
import { useEffect, type ComponentType } from "react";

interface GameModalProps {
  Component: ComponentType;
  onClose: () => void;
}

export function GameModal({ Component, onClose }: GameModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90">
      <button
        onClick={onClose}
        aria-label="Cerrar juego"
        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full border border-[#4ade80] bg-black/70 text-[#4ade80] hover:bg-[#4ade80]/20 transition-colors"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      <Component />
    </div>
  );
}