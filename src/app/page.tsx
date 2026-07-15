'use client'
import { useEffect, useRef } from "react";
import { MainLoop } from "@/engine/core/MainLoop/mainLoop";
import { CanvasHandler } from "@/engine/core/Render/canvasHandler";
import { SpriteRenderer } from "@/engine/core/Render/spritesRender";
import { AssetLoader } from "@/engine/core/Render/AssetLoader";
import { RenderSystem } from "@/engine/core/Render/render";
import { createTestMap, getMapDimensions } from "@/engine/instancies/testMap";
import { GameManager } from "@/engine/instancies/gameManager";

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
    renderSystem.setMap(testMap);

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

    renderSystem.setTank(game.tank);

    let loop: MainLoop;

    const updateLoop = {
      movementOfEntities: () => {
        const dt = loop.getDeltaTime;
        game.update(dt > 0 ? dt : 16.67);
      },
      collisionHandler: () => {},
      updateState: () => {
        renderSystem.setBullets(game.bullets);
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
