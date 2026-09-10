import type { GameDefinition } from "@/games/registry";
import { SteelFuryCapture } from "@/games/steel-fury/SteelFuryCapture";

interface GamePreviewProps {
  game: GameDefinition;
  onLaunch: () => void;
}

export function GamePreview({ game, onLaunch }: GamePreviewProps) {
  return (
    <div className="h-full w-full flex flex-col gap-6 p-8 overflow-y-auto">
      <div className="text-left">
        <h1 className="text-3xl font-bold text-white">{game.name}</h1>
        <p className="text-sm font-mono text-gray-500 mt-1">{game.genre}</p>
      </div>

      <div className="rounded-lg overflow-hidden border border-[#2a2a2a] bg-black aspect-[16/10]">
        <SteelFuryCapture />
      </div>

      <p className="text-gray-300 leading-relaxed max-w-3xl">{game.description}</p>

      <div className="mt-auto flex flex-wrap items-center gap-6">
        <button
          onClick={onLaunch}
          className="inline-flex items-center gap-3 px-8 py-3.5 rounded border border-[#4ade80] bg-[#4ade80] text-black font-bold hover:bg-[#4ade80]/90 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
          JUGAR AHORA
        </button>

        <div className="flex gap-4">
          {game.stats.map((stat) => (
            <div key={stat.label} className="rounded border border-[#2a2a2a] bg-[#111] px-4 py-2">
              <div className="text-lg font-mono text-white">{stat.value}</div>
              <div className="text-[11px] text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}