"use client";
import { useTankGame } from "./useTankGame";

export function SteelFuryGame() {
  const { canvasRef, status, score, finalScore, start, restart } = useTankGame();

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-contain [image-rendering:pixelated] bg-black"
      />

      {status !== "idle" && (
        <div className="absolute top-4 left-4 pointer-events-none">
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
          <span className="text-2xl font-mono tracking-widest text-gray-300 uppercase">
            Steel Fury
          </span>
          <span className="inline-flex items-center gap-3 px-10 py-4 rounded border border-[#f59e0b] bg-[#f59e0b]/10 text-[#fbbf24] font-mono text-xl group-hover:bg-[#f59e0b]/20 transition-colors">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
            START
          </span>
          <span className="text-sm text-gray-500 font-mono">
            move: WASD / arrows · shoot: space · restart: R
          </span>
        </button>
      )}

      {status === "gameover" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80">
          <h2 className="text-5xl font-bold text-red-500 tracking-wide">GAME OVER</h2>
          <p className="font-mono text-2xl text-white">Score: {finalScore}</p>
          <button
            onClick={restart}
            className="px-8 py-3 rounded border border-[#4ade80] bg-[#4ade80]/10 text-[#4ade80] font-mono text-lg hover:bg-[#4ade80]/20 transition-colors"
          >
            RESTART
          </button>
          <span className="text-sm text-gray-500 font-mono">or press R</span>
        </div>
      )}
    </div>
  );
}