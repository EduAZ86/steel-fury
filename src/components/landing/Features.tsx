const FEATURES = [
  {
    title: "MainLoop & DeltaTime",
    desc: "A requestAnimationFrame pipeline with decoupled update/draw phases and a delta-time clock. Tracks APS/FPS out of the box.",
  },
  {
    title: "EntitySystem",
    desc: "Unity-style entities: Transform, RigidBody2D and lifecycle hooks (Awake, Start, Update, OnCollision). Compose games from objects, not switch statements.",
  },
  {
    title: "Collision2D",
    desc: "Axis-aligned square collision with resolved contact faces, ready to feed into physics or gameplay logic.",
  },
  {
    title: "RenderSystem",
    desc: "Canvas-backed rendering with sprite, rect, circle and text primitives — plus rotation, scale and alpha per draw call.",
  },
  {
    title: "AssetLoader",
    desc: "Cached and de-duplicated async asset loading. Request the same texture from anywhere without double-fetching.",
  },
  {
    title: "Input & Screen",
    desc: "Keyboard and mouse snapshots behind one device interface, with a responsive screen-size tracker.",
  },
];

export function Features() {
  return (
    <section className="px-6 py-16 max-w-6xl mx-auto">
      <h2 className="text-center text-2xl sm:text-3xl font-bold text-white mb-2">
        A small core, cleanly separated
      </h2>
      <p className="text-center text-gray-400 mb-12 max-w-xl mx-auto">
        The engine never imports the game. It exposes interfaces the game satisfies —
        so the demo is an instance, not the engine.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-lg border border-[#2a2a2a] bg-[#111] p-5 hover:border-[#4ade80]/50 hover:bg-[#161616] transition-colors"
          >
            <h3 className="font-mono text-[#fbbf24] mb-2">{f.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}