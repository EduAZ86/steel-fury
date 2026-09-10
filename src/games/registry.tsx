import type { ComponentType } from "react";
import { SteelFuryGame } from "./steel-fury/SteelFuryGame";

export interface GameDefinition {
  id: string;
  name: string;
  genre: string;
  description: string;
  accent: string;
  stats: { label: string; value: string }[];
  status: "playable" | "coming-soon";
  Component?: ComponentType;
}

export const GAMES: GameDefinition[] = [
  {
    id: "steel-fury",
    name: "Steel Fury",
    genre: "Acción · Tanques",
    description:
      "Empuña el acero y defiende tu base en una arena de tanques. Sobrevive a oleadas de enemigos, domina el disparo en movimiento y prueba tu puntuación más alta.",
    accent: "#4ade80",
    stats: [
      { label: "Tiempo jugado", value: "14.5 h" },
      { label: "Logros", value: "12 / 30" },
    ],
    status: "playable",
    Component: SteelFuryGame,
  },
  {
    id: "juego-1",
    name: "Juego 1",
    genre: "Género · Pendiente",
    description: "Un próximo título forjado con el motor. En desarrollo.",
    accent: "#f59e0b",
    stats: [],
    status: "coming-soon",
  },
  {
    id: "juego-2",
    name: "Juego 2",
    genre: "Género · Pendiente",
    description: "Un próximo título forjado con el motor. En desarrollo.",
    accent: "#60a5fa",
    stats: [],
    status: "coming-soon",
  },
];