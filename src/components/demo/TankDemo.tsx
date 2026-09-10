"use client";
import { useTankGame } from "./useTankGame";
import { BRAND } from "@/lib/brand";

export function TankDemo() {
  const { canvasRef, status, score, finalScore, start, restart } = useTankGame();

  return (
    <div className="w-full max-w-[640px] mx-auto rounded-lg overflow-hidden border border-[#333] bg-[#111] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)]">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1a1a] border-b border-[#333]">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#dc2626]" />
          <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
          <span className="w-3 h-3 rounded-full bg-[#4ade80]" />
        </div>
        <span className="ml-2 text-xs font-mono text-gray-400">
          {BRAND.demoName} — {BRAND.name} demo
        </span>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          className="block w-full h-auto [image-rendering:pixelated] bg-black"
        />

        {status !== "idle" && (
          <div className="absolute top-3 left-3 pointer-events-none">
            <div className="bg-black/70 px-3 py-1.5 rounded font-mono text-sm text-white">
              SCORE: {score}
            </div>
          </div>
        )}

        {status === "idle" && (
          <button
            onClick={start}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/70 group focus:outline-none focus:ring-2 focus:ring-[#f59e0b]"
          >
            <span className="text-sm font-mono tracking-widest text-gray-300 uppercase">
              Steel Fury
            </span>
            <span className="inline-flex items-center gap-3 px-8 py-3 rounded border border-[#f59e0b] bg-[#f59e0b]/10 text-[#fbbf24] font-mono text-lg group-hover:bg-[#f59e0b]/20 transition-colors">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              START
            </span>
            <span className="text-xs text-gray-500 font-mono">
              move: WASD / arrows · shoot: space · restart: R
            </span>
          </button>
        )}

        {status === "gameover" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80">
            <h2 className="text-4xl font-bold text-red-500 tracking-wide">GAME OVER</h2>
            <p className="font-mono text-lg text-white">Score: {finalScore}</p>
            <button
              onClick={restart}
              className="px-6 py-2 rounded border border-[#4ade80] bg-[#4ade80]/10 text-[#4ade80] font-mono hover:bg-[#4ade80]/20 transition-colors"
            >
              RESTART
            </button>
            <span className="text-xs text-gray-500 font-mono">or press R</span>
          </div>
        )}
      </div>
    </div>
  );
}