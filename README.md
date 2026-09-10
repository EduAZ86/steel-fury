# Forge2D

A tiny, extensible 2D game engine for the browser. The engine is the product; the
game is just an instance.

## Repo layout

- `src/engine` — the **Forge2D** engine: main loop & delta-time, entity system,
  AABB collision, canvas renderer (sprites/primitives), cached asset loader,
  keyboard/mouse input and screen handling. It never imports the game.
- `src/game` — **Steel Fury**, a Battle City–style tank demo built as an instance
  of the engine (maps, entities, enemy AI, collision, rendering for the demo).
- `src/app` — a landing page for the engine with the tank demo embedded in a
  framed window (press **START** to play).

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000. Controls: WASD / arrows to move, space to shoot, R to
restart.

## Build & check

```bash
npm run build   # includes typecheck
npm run lint
```

## Roadmap

- [ ] Camera / viewport (screen↔world transform, scroll & zoom)
- [ ] Layer system & data-driven rendering (draw from renderable data, not live refs)
- [ ] Viewport culling for tiles
- [ ] Sprite sheets / animation controller
- [ ] Particle & effect system
- [ ] Fixed timestep with interpolation
- [ ] Spatial partitioning for collision
- [ ] Publish the engine as a standalone package