# Forge2D

Motor 2D minimalista y extensible para el navegador, escrito en TypeScript sobre
Canvas API. **El motor es el producto; el juego es solo una instancia.** Incluye un
lanzador web (landing + modal full-screen) y un juego de ejemplo completo.

## Descripción del motor

Forge2D no impone arquitectura de juego: expone piezas pequeñas y componibles que
tú conectas. Todo lo que el motor necesita del juego entra por interfaces
(`updateIteration`, `drawIteration`, `IGameRenderer`), por lo que el motor nunca
importa código del juego.

### Componentes (`src/engine`)

| Módulo | Export | Qué hace |
| --- | --- | --- |
| MainLoop | `MainLoop` | Bucle con `requestAnimationFrame` y delta-time. Ejecuta las fases de update (`movementOfEntities`, `collisionHandler`, `updateState`, `updatePhysics`, `inputsHandler`, `updateIA`, `syncMultiplayerState?`) y de draw (`drawMap`, `drawEntities`, `drawEntitiesState`, `drawEffects`). `start()` / `stop()`, y `getDeltaTime` en ms. |
| DeltaTime | `DeltaTime` | Calcula el tiempo entre frames. |
| EntitySystem | `Entity`, `GameObject`, `Transform`, `RigidBody2D`, `Vector2D`, `SquareShape` | Modelo de objetos: `GameObject` (id, transform, rigid body, `Destroy`, `OnCollision2D`), `Entity` (health, coroutines, ciclo `Awake/Start/Update/OnDestroy`) y geometría. |
| Collision2D | `Collision2D` | Colisión AABB entre `SquareShape`; devuelve la cara de impacto (`top`/`bottom`/`left`/`right`) y permite calcular velocidad relativa. |
| Render | `CanvasHandler`, `SpriteRenderer`, `AssetLoader`, `RenderSystem` | `CanvasHandler` inicializa/redimensiona el canvas; `SpriteRenderer` dibuja sprites (con rotación, escala, pivote y alpha), rectángulos, círculos, texto y barras de vida; `AssetLoader` carga y cachea imágenes; `RenderSystem` delega el dibujo en el `IGameRenderer` del juego. |
| Input | `Inputs`, `ArrowSpaceEnterEscKeys`, `MouseInput` | Entrada de teclado (flechas, espacio, enter, esc) y ratón (click, rueda, posición), con `startTracking` / `stopTracking`. |
| Screen | `ScreenSize` | Dimensiones de la ventana y callback `onResize`. |

Todo se re-exporta desde `@/engine` (`src/engine/index.ts`).

### Cómo usarlo

1. **Crea el canvas y el sistema de render**

```ts
import { CanvasHandler, RenderSystem, SpriteRenderer, AssetLoader, MainLoop } from "@/engine";

const canvasHandler = new CanvasHandler();
canvasHandler.init(canvasElement);
canvasHandler.resize(cols * tileSize, rows * tileSize);

const renderSystem = new RenderSystem(canvasHandler, new SpriteRenderer(), new AssetLoader());
```

2. **Implementa el `IGameRenderer` de tu juego** (drawMap, drawEntities,
   drawEntitiesState, drawEffects) y engánchalo con
   `renderSystem.setGameRenderer(myRenderer)`.

3. **Define las fases del update/draw** y crea el bucle

```ts
const updateIteration = {
  movementOfEntities: () => { /* tu lógica */ },
  collisionHandler: () => {},
  updateState: () => {},
  updatePhysics: () => {},
  inputsHandler: () => {},
  updateIA: () => {},
};

const loop = new MainLoop(updateIteration, renderSystem); // renderSystem implementa drawIteration
loop.start(); // loop.stop() para detener
```

4. **Entidades**: construye un `GameObject` con `Transform` y `RigidBody2D`,
   envuélvelo en una `Entity` y llama a `new Collision2D(a.rigidBody.collisionShape, b.rigidBody.collisionShape).onCollision()`
   para resolver impactos.

## Estructura del repositorio

- `src/engine` — el motor **Forge2D**. Nunca importa el juego.
- `examples/steel-fury` — **Steel Fury**, un demo estilo Battle City construido como
  instancia del motor (mapas generados, entidades, IA de enemigos, colisiones, render).
- `src/app` + `src/components/launcher` — landing y lanzador: una barra lateral lista
  los juegos, un panel de preview muestra el seleccionado y **JUGAR AHORA** lanza el
  juego a pantalla completa en un modal.
- `src/games` — registro de juegos (`registry.tsx`) y el pegamento React que monta
  cada ejemplo sobre el motor (`bootstrap.ts`, `useTankGame.ts`, `SteelFuryGame.tsx`).

Alias de importación: `@/*` → `./src/*`, `@examples/*` → `./examples/*`.

## Ejemplo: Steel Fury

Un juego de tanques por oleadas:

- **Mapa generado** con semilla (`MapGenerator` + `SeededRandom`): terreno, agua,
  bosque, estructuras destructibles y base.
- **Jugador** (`Tank` + `PlayerController`): movimiento con aceleración/inercia y
  disparo con recarga.
- **Enemigos** (`Enemy` + `IA` + `EnemySpawner`): oleadas con distintos tipos
  (grunt, scout, heavy, artillery, commander) y comportamiento de IA.
- **Colisiones** (`CollisionSystem`): bloqueo contra muros, terreno que ralentiza,
  destrucción de estructuras y daño.
- **Estado** (`GameState`): puntuación y fin de partida (vida a 0 o base destruida).
- **Assets**: texturas SVG en `public/assets/textures`, convertidas a PNG con
  `scripts/convert-svg-to-png.ts` y cargadas por `AssetLoader`.

Flujo de montaje en React: `bootstrapSteelFury(canvas)` construye canvas, mapa,
render y `GameManager`; `createSteelFuryLoop(resources, onGameOver)` arma el
`MainLoop`; `useTankGame` gestiona estados `idle | playing | gameover`, el HUD de
puntuación y el reinicio.

## Ejecutar

```bash
npm install
npm run dev
```

Abre http://localhost:3000. Controles (Steel Fury): **WASD / flechas** para mover,
**espacio** para disparar, **R** para reiniciar.

## Build y comprobaciones

```bash
npm run build   # incluye typecheck
npm run lint
```

## Añadir un nuevo juego de ejemplo

1. Crea `examples/<mi-juego>/` con tu código basado en el motor.
2. Añade un `Component` (pegamento React) que arranque el motor para ese juego.
3. Registra una entrada en `src/games/registry.tsx` — aparecerá en el lanzador.

## Roadmap

- [ ] Cámara / viewport (transformación pantalla↔mundo, scroll y zoom)
- [ ] Sistema de capas y render data-driven (dibujar desde datos, no refs vivas)
- [ ] Culling de tiles por viewport
- [ ] Sprite sheets / controlador de animación
- [ ] Sistema de partículas y efectos
- [ ] Timestep fijo con interpolación
- [ ] Particionado espacial para colisiones
- [ ] Publicar el motor como paquete independiente

---

**Desarrollador:** Eduardo Fabio Ayaviri Zuna
**Versión:** 0.1.0
