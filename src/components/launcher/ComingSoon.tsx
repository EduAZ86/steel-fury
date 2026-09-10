import type { GameDefinition } from "@/games/registry";

export function ComingSoon({ game }: { game: GameDefinition }) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-4 text-center p-8">
      <span className="text-5xl">🚧</span>
      <h1 className="text-3xl font-bold text-white">{game.name}</h1>
      <p className="font-mono text-sm tracking-widest text-[#f59e0b] uppercase">
        Próximamente
      </p>
      <p className="text-gray-500 max-w-md">{game.description}</p>
    </div>
  );
}