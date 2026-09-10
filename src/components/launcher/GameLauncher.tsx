"use client";
import { useState } from "react";
import { GAMES } from "@/games/registry";
import { GameSidebar } from "./GameSidebar";
import { GamePreview } from "./GamePreview";
import { ComingSoon } from "./ComingSoon";
import { GameModal } from "./GameModal";

export function GameLauncher() {
  const [activeId, setActiveId] = useState(GAMES[0].id);
  const [isLaunched, setIsLaunched] = useState(false);

  const active = GAMES.find((g) => g.id === activeId) ?? GAMES[0];

  const handleSelect = (id: string) => {
    setActiveId(id);
    setIsLaunched(false);
  };

  return (
    <section className="h-screen w-full bg-[#0a0a0a] border-y border-[#1f1f1f]">
      <div className="h-full flex overflow-hidden">
        <GameSidebar games={GAMES} activeId={activeId} onSelect={handleSelect} />

        <div className="flex-1 min-w-0">
          {active.status === "playable" ? (
            <GamePreview game={active} onLaunch={() => setIsLaunched(true)} />
          ) : (
            <ComingSoon game={active} />
          )}
        </div>
      </div>

      {isLaunched && active.Component && (
        <GameModal Component={active.Component} onClose={() => setIsLaunched(false)} />
      )}
    </section>
  );
}