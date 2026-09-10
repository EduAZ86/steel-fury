"use client";
import { useEffect, useRef } from "react";
import { bootstrapSteelFury } from "./bootstrap";

export function SteelFuryCapture() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const res = bootstrapSteelFury(canvas);
    res.renderSystem.drawMap();
    res.renderer.drawEntities();
    res.renderer.incrementFrame();

    const id = window.setTimeout(() => {
      res.renderSystem.drawMap();
      res.renderer.drawEntities();
    }, 600);

    return () => {
      window.clearTimeout(id);
      res.game.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full object-contain [image-rendering:pixelated] bg-black"
    />
  );
}