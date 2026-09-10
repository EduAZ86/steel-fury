"use client";
import type { GameDefinition } from "@/games/registry";
import { BRAND } from "@/lib/brand";

interface GameSidebarProps {
  games: GameDefinition[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function GameSidebar({ games, activeId, onSelect }: GameSidebarProps) {
  return (
    <aside className="w-72 shrink-0 h-full flex flex-col border-r border-[#2a2a2a] bg-[#0d0d0d]">
      <div className="px-5 py-5 border-b border-[#2a2a2a]">
        <p className="font-mono text-sm tracking-[0.3em] text-[#4ade80] uppercase">
          {BRAND.name}
        </p>
        <p className="text-xs text-gray-500 mt-1">Selecciona un juego</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-2">
        {games.map((game) => {
          const active = game.id === activeId;
          const comingSoon = game.status === "coming-soon";
          return (
            <button
              key={game.id}
              onClick={() => onSelect(game.id)}
              aria-pressed={active}
              className={`w-full text-left rounded-lg border px-4 py-3 transition-colors ${
                active
                  ? "border-[#4ade80]/60 bg-[#1a1a1a]"
                  : "border-[#2a2a2a] bg-[#111] hover:bg-[#161616]"
              } ${comingSoon && !active ? "opacity-60" : ""}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-lg"
                  style={{ color: active ? game.accent : "#9ca3af" }}
                >
                  🎮
                </span>
                <div className="min-w-0">
                  <div className="truncate font-medium text-white">{game.name}</div>
                  <div className="truncate text-xs text-gray-500">{game.genre}</div>
                </div>
              </div>
              {game.status === "coming-soon" && (
                <div className="mt-1.5 inline-block rounded bg-[#f59e0b]/10 px-1.5 py-0.5 text-[10px] font-mono text-[#fbbf24]">
                  PRÓXIMAMENTE
                </div>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-[#2a2a2a] text-[11px] text-gray-600 font-mono">
        Motor {BRAND.name} · juegos como instancias
      </div>
    </aside>
  );
}