import { BRAND } from "@/lib/brand";

const CODE = `// the engine is the product; the game is just an instance.
const renderSystem = new RenderSystem(canvasHandler, spriteRenderer, assetLoader);

const game = new GameManager(mapData, config);
gameRenderer.setTank(game.tank);

const loop = new MainLoop(
  {
    movementOfEntities: () => game.update(delta),
    updateState: () => { /* sync renderable state */ },
  },
  renderSystem
);

loop.start();`;

export function CodeSection() {
  return (
    <section className="px-6 py-16 max-w-3xl mx-auto">
      <h2 className="text-center text-2xl sm:text-3xl font-bold text-white mb-2">
        Engine-first, game-second
      </h2>
      <p className="text-center text-gray-400 mb-8 max-w-xl mx-auto">
        {BRAND.demoName} boots the engine in a few lines. Most of the hard parts — the
        loop, rendering and loading — live in the engine, not the game.
      </p>
      <pre className="rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] p-5 text-sm leading-relaxed overflow-x-auto">
        <code className="font-mono text-[#e2e8f0]">{CODE}</code>
      </pre>
    </section>
  );
}