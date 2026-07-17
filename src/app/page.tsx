'use client'
import { useEffect, useRef } from "react";
import { MainLoop, RenderSystem, CanvasHandler, SpriteRenderer, AssetLoader } from "@/engine";
import { GameManager, createTestMap, getMapDimensions, GameRenderer } from "@/game";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loopRef = useRef<MainLoop | null>(null);
  const gameRef = useRef<GameManager | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvasHandler = new CanvasHandler();
    canvasHandler.init(canvasRef.current);

    const mapDims = getMapDimensions();
    canvasHandler.resize(mapDims.width, mapDims.height);

    const spriteRenderer = new SpriteRenderer();
    const assetLoader = new AssetLoader();
    const renderSystem = new RenderSystem(canvasHandler, spriteRenderer, assetLoader);

    const testMap = createTestMap();

    const gameRenderer = new GameRenderer(canvasHandler, spriteRenderer, assetLoader);
    gameRenderer.setMap(testMap);
    renderSystem.setGameRenderer(gameRenderer);

    const game = new GameManager(testMap, {
      tank: {
        maxSpeed: 150,
        acceleration: 400,
        deceleration: 3,
        rotationSpeed: 180,
        tileSize: mapDims.tileSize,
        tankSize: mapDims.tileSize - 4,
        health: 100,
      },
      bullet: {
        speed: 300,
        size: 6,
        damage: 50,
      },
      enemies: {
        maxCount: 8,
        spawnInterval: 3000,
      },
    });
    gameRef.current = game;

    gameRenderer.setTank(game.tank);

    let loop: MainLoop;

    const updateLoop = {
      movementOfEntities: () => {
        const dt = loop.getDeltaTime;
        game.update(dt > 0 ? dt : 16.67);
      },
      collisionHandler: () => {},
      updateState: () => {
        gameRenderer.setBullets(game.bullets);
        gameRenderer.setEnemies(game.enemies);
      },
      updatePhysics: () => {},
      inputsHandler: () => {},
      updateIA: () => {},
    };

    loop = new MainLoop(updateLoop, renderSystem);
    loopRef.current = loop;
    loop.start();

    return () => {
      loop.stop();
      game.destroy();
    };
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0a0a0a]">
      <canvas
        ref={canvasRef}
        className="border-2 border-[#333] [image-rendering:pixelated]"
      />
    </div>
  );
}
