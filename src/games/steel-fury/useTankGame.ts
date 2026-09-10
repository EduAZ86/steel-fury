import { useCallback, useEffect, useRef, useState } from "react";
import {
  bootstrapSteelFury,
  createSteelFuryLoop,
  SteelFuryResources,
} from "./bootstrap";
import type { MainLoop } from "@/engine";

export type TankGameStatus = "idle" | "playing" | "gameover";

const HUD_COMMIT_INTERVAL = 150;

export function useTankGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const resourcesRef = useRef<{ res: SteelFuryResources; loop: MainLoop | null } | null>(null);
  const scoreRef = useRef(0);
  const wasOverRef = useRef(false);
  const lastCommitRef = useRef(0);

  const [status, setStatus] = useState<TankGameStatus>("idle");
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

  const teardown = useCallback(() => {
    const entry = resourcesRef.current;
    if (entry) {
      entry.loop?.stop();
      entry.res.game.destroy();
      resourcesRef.current = null;
    }
    scoreRef.current = 0;
    wasOverRef.current = false;
  }, []);

  const boot = useCallback(() => {
    teardown();
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const res = bootstrapSteelFury(canvas);
    res.renderSystem.drawMap();
    res.renderer.drawEntities();

    resourcesRef.current = { res, loop: null };
    return true;
  }, [teardown]);

  const run = useCallback(() => {
    const entry = resourcesRef.current;
    if (!entry) return;

    const loop = createSteelFuryLoop(entry.res, () => {
      if (!wasOverRef.current) {
        wasOverRef.current = true;
        setFinalScore(entry.res.game.score);
        setScore(entry.res.game.score);
        setStatus("gameover");
      }
    });
    entry.loop = loop;

    setScore(0);
    setFinalScore(0);
    setStatus("playing");
    loop.start();

    const tick = () => {
      if (!entry.loop) return;
      const current = entry.res.game.score;
      if (scoreRef.current !== current) {
        scoreRef.current = current;
        const now = performance.now();
        if (now - lastCommitRef.current >= HUD_COMMIT_INTERVAL) {
          lastCommitRef.current = now;
          setScore(current);
        }
      }
      if (entry.loop) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  const start = useCallback(() => {
    if (boot()) run();
  }, [boot, run]);

  const restart = useCallback(() => start(), [start]);

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

  return { canvasRef, status, score, finalScore, start, restart };
}