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
        speed: 150,
        tileSize: mapDims.tileSize,
        tankSize: mapDims.tileSize - 4,
      },
      bullet: {
        speed: 300,
        size: 6,
        damage: 50,
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
      },
      updatePysics: () => {},
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
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#0a0a0a',
    }}>
      <canvas
        ref={canvasRef}
        style={{
          border: '2px solid #333',
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
}
