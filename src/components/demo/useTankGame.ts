import { useCallback, useEffect, useRef, useState } from "react";
import {
  MainLoop,
  RenderSystem,
  CanvasHandler,
  SpriteRenderer,
  AssetLoader,
} from "@/engine";
import {
  GameManager,
  MapGenerator,
  loadAllAssets,
  GameRenderer,
} from "@/game";

export type TankGameStatus = "idle" | "playing" | "gameover";

interface Resources {
  loop: MainLoop | null;
  game: GameManager;
  renderer: GameRenderer;
  renderSystem: RenderSystem;
}

const HUD_COMMIT_INTERVAL = 150;

export function useTankGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const resourcesRef = useRef<Resources | null>(null);
  const scoreRef = useRef(0);
  const wasOverRef = useRef(false);
  const lastCommitRef = useRef(0);

  const [status, setStatus] = useState<TankGameStatus>("idle");
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

  const teardown = useCallback(() => {
    const res = resourcesRef.current;
    if (res) {
      res.loop?.stop();
      res.game.destroy();
      resourcesRef.current = null;
    }
    scoreRef.current = 0;
    wasOverRef.current = false;
  }, []);

  const boot = useCallback(() => {
    teardown();
    const canvas = canvasRef.current;
    if (!canvas) return false;

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

    renderSystem.drawMap();
    gameRenderer.drawEntities();

    resourcesRef.current = { loop: null, game, renderer: gameRenderer, renderSystem };
    return true;
  }, [teardown]);

  const run = useCallback(() => {
    const res = resourcesRef.current;
    if (!res) return;

    const updateLoop = {
      movementOfEntities: () => {
        const dt = res.loop?.getDeltaTime ?? 16.67;
        res.game.update(dt > 0 ? dt : 16.67);

        const current = res.game.score;
        if (scoreRef.current !== current) {
          scoreRef.current = current;
          const now = performance.now();
          if (now - lastCommitRef.current >= HUD_COMMIT_INTERVAL) {
            lastCommitRef.current = now;
            setScore(current);
          }
        }

        if (res.game.isGameOver) {
          if (!wasOverRef.current) {
            wasOverRef.current = true;
            setFinalScore(current);
            setScore(current);
            setStatus("gameover");
          }
        } else {
          wasOverRef.current = false;
        }
      },
      collisionHandler: () => {},
      updateState: () => {
        res.renderer.setBullets(res.game.bullets);
        res.renderer.setEnemies(res.game.enemies);
      },
      updatePhysics: () => {},
      inputsHandler: () => {},
      updateIA: () => {},
    };

    const loop = new MainLoop(updateLoop, res.renderSystem);
    res.loop = loop;
    setScore(0);
    setFinalScore(0);
    setStatus("playing");
    loop.start();
  }, []);

  const start = useCallback(() => {
    if (boot()) run();
  }, [boot, run]);

  const restart = useCallback(() => {
    start();
  }, [start]);

  useEffect(() => {
    boot();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") {
        start();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      teardown();
    };
  }, [boot, start, teardown]);

  return {
    canvasRef,
    status,
    score,
    finalScore,
    start,
    restart,
  };
}
