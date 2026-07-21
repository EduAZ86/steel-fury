'use client'
import { useEffect, useRef, useState, useCallback } from "react";
import { MainLoop, RenderSystem, CanvasHandler, SpriteRenderer, AssetLoader } from "@/engine";
import { GameManager, MapGenerator, GeneratedMap, loadAllAssets, GameRenderer } from "@/game";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loopRef = useRef<MainLoop | null>(null);
  const gameRef = useRef<GameManager | null>(null);
  const rendererRef = useRef<GameRenderer | null>(null);

  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const startGame = useCallback(async () => {
    if (!canvasRef.current) return;

    if (loopRef.current) {
      loopRef.current.stop();
    }
    if (gameRef.current) {
      gameRef.current.destroy();
    }

    const canvasHandler = new CanvasHandler();
    canvasHandler.init(canvasRef.current);

    const mapData = MapGenerator.generate();
    const tileSize = mapData.tileSize;
    const cols = mapData.tiles[0].length;
    const rows = mapData.tiles.length;
    const mapWidth = cols * tileSize;
    const mapHeight = rows * tileSize;

    canvasHandler.resize(mapWidth, mapHeight);

    const spriteRenderer = new SpriteRenderer();
    const assetLoader = new AssetLoader();
    await loadAllAssets(assetLoader);
    const renderSystem = new RenderSystem(canvasHandler, spriteRenderer, assetLoader);

    const gameRenderer = new GameRenderer(canvasHandler, spriteRenderer, assetLoader);
    gameRenderer.setMap(mapData);
    renderSystem.setGameRenderer(gameRenderer);
    rendererRef.current = gameRenderer;

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

    setIsGameOver(false);
    setScore(0);

    const updateLoop = {
      movementOfEntities: () => {
        const dt = loopRef.current?.getDeltaTime ?? 16.67;
        game.update(dt > 0 ? dt : 16.67);
        setScore(game.score);
        if (game.isGameOver) {
          setFinalScore(game.score);
          setIsGameOver(true);
        }
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

    const loop = new MainLoop(updateLoop, renderSystem);
    loopRef.current = loop;
    loop.start();
  }, []);

  useEffect(() => {
    startGame();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") {
        if (gameRef.current?.isGameOver) {
          startGame();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      loopRef.current?.stop();
      gameRef.current?.destroy();
    };
  }, [startGame]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0a0a0a] relative">
      <canvas
        ref={canvasRef}
        className="border-2 border-[#333] [image-rendering:pixelated]"
      />

      <div className="absolute top-4 left-4 text-white font-mono text-lg">
        <div className="bg-black/60 px-4 py-2 rounded">
          SCORE: {score}
        </div>
      </div>

      {isGameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-red-500 mb-4">GAME OVER</h1>
            <p className="text-2xl text-white mb-6">Score: {finalScore}</p>
            <p className="text-lg text-gray-400">Press R to restart</p>
          </div>
        </div>
      )}
    </div>
  );
}
