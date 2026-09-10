import { BRAND } from "@/lib/brand";

export function Hero() {
  return (
    <header className="relative text-center px-6 pt-24 pb-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(74,222,128,0.08),transparent_60%)]" />
      <p className="font-mono text-sm tracking-[0.4em] text-[#4ade80] uppercase mb-4">
        {BRAND.name}
      </p>
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
        A 2D engine you can{" "}
        <span className="text-[#f59e0b]">forge</span> games with.
      </h1>
      <p className="mt-5 max-w-2xl mx-auto text-lg text-gray-400">
        {BRAND.tagline} A small, typed core — main loop, entity system, collision,
        canvas renderer and input — with the game itself as just another instance.
      </p>
      <p className="mt-3 font-mono text-xs text-gray-500">
        Live proof below: {BRAND.demoName}, a tank battle demo built on top of the engine.
      </p>
    </header>
  );
}