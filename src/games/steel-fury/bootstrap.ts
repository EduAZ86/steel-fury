import {
  CanvasHandler,
  RenderSystem,
  SpriteRenderer,
  AssetLoader,
  MainLoop,
} from "@/engine";
import { GameManager, MapGenerator, loadAllAssets, GameRenderer } from "@examples/steel-fury";

export interface SteelFuryResources {
  canvasHandler: CanvasHandler;
  renderSystem: RenderSystem;
  renderer: GameRenderer;
  game: GameManager;
}

export function bootstrapSteelFury(canvas: HTMLCanvasElement): SteelFuryResources {
  const canvasHandler = new CanvasHandler();
  canvasHandler.init(canvas);

  const mapData = MapGenerator.generate();
  const tileSize = mapData.tileSize;
  const cols = mapData.tiles[0].length;
  const rows = mapData.tiles.length;
  canvasHandler.resize(cols * tileSize, rows * tileSize);

  const spriteRenderer = new SpriteRenderer();
  const assetLoader = new AssetLoader();

  void loadAllAssets(assetLoader).catch(() => {});

  const renderSystem = new RenderSystem(canvasHandler, spriteRenderer, assetLoader);

  const gameRenderer = new GameRenderer(canvasHandler, spriteRenderer, assetLoader);
  gameRenderer.setMap(mapData);

  const game = new GameManager(mapData, {
    tank: {
      maxSpeed: 150,
      acceleration: 400,
      deceleration: 3,
      rotationSpeed: 180,
      tileSize,
      tankSize: tileSize - 4,
      health: 100,
    },
    bullet: { speed: 300, size: 6, damage: 50 },
    enemies: { maxCount: 8, spawnInterval: 3000 },
  });

  gameRenderer.setTank(game.tank);
  gameRenderer.setBullets(game.bullets);
  gameRenderer.setEnemies(game.enemies);
  renderSystem.setGameRenderer(gameRenderer);

  return { canvasHandler, renderSystem, renderer: gameRenderer, game };
}

export function createSteelFuryLoop(
  resources: SteelFuryResources,
  onGameOver?: (score: number) => void
): MainLoop {
  let loop: MainLoop;

  const updateLoop = {
    movementOfEntities: () => {
      const dt = loop.getDeltaTime ?? 16.67;
      resources.game.update(dt > 0 ? dt : 16.67);
      if (resources.game.isGameOver) {
        onGameOver?.(resources.game.score);
      }
    },
    collisionHandler: () => {},
    updateState: () => {
      resources.renderer.setBullets(resources.game.bullets);
      resources.renderer.setEnemies(resources.game.enemies);
    },
    updatePhysics: () => {},
    inputsHandler: () => {},
    updateIA: () => {},
  };

  loop = new MainLoop(updateLoop, resources.renderSystem);
  return loop;
}