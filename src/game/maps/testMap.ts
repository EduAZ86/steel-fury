import { Cell, CellMap } from "./types";

const TILE_SIZE = 32;

function cell(type: string, color: string, hardness: number, speedModifier: number, passThrough: boolean, isObstacle: boolean, isGround: boolean): Cell {
    return { type, properties: { color, hardness, speedModifier, passThrough, isObstacle, isGround } };
}

const E: Cell = cell('empty', '#1a1a2e', 0, 1.0, true, false, false);
const B: Cell = cell('brick', '#b45309', 2, 0.0, false, true, false);
const S: Cell = cell('steel', '#9ca3af', -1, 0.0, false, true, false);
const W: Cell = cell('water', '#3b82f6', 1, 0.4, true, false, true);
const F: Cell = cell('forest', '#166534', 1, 0.7, true, false, true);
const X: Cell = cell('base', '#dc2626', -1, 0.0, false, true, false);

const map: CellMap = [
    [E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E],
    [E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E],
    [E,E,B,B,E,E,B,B,E,E,B,B,E,E,B,B,E,E,B,B,E,E,B,B,E,E,E],
    [E,E,B,B,E,E,B,B,E,E,B,B,E,E,B,B,E,E,B,B,E,E,B,B,E,E,E],
    [E,E,B,B,E,E,B,B,E,E,B,B,E,E,B,B,E,E,B,B,E,E,B,B,E,E,E],
    [E,E,B,B,E,E,B,B,E,E,B,B,E,E,B,B,E,E,B,B,E,E,B,B,E,E,E],
    [E,E,B,B,E,E,B,B,E,E,B,B,S,S,B,B,E,E,B,B,E,E,B,B,E,E,E],
    [E,E,B,B,E,E,B,B,E,E,B,B,S,S,B,B,E,E,B,B,E,E,B,B,E,E,E],
    [E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E],
    [E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E],
    [E,E,B,B,E,E,E,E,E,E,B,B,E,E,B,B,E,E,E,E,E,E,B,B,E,E,E],
    [E,E,B,B,E,E,E,E,E,E,B,B,E,E,B,B,E,E,E,E,E,E,B,B,E,E,E],
    [E,E,B,B,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,B,B,E,E,E],
    [E,E,B,B,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,B,B,E,E,E],
    [E,E,E,E,E,E,B,B,E,E,E,E,E,E,E,E,E,E,B,B,E,E,E,E,E,E,E],
    [E,E,E,E,E,E,B,B,E,E,E,E,E,E,E,E,E,E,B,B,E,E,E,E,E,E,E],
    [E,E,B,B,E,E,B,B,E,E,E,E,F,F,E,E,E,E,B,B,E,E,B,B,E,E,E],
    [E,E,B,B,E,E,B,B,E,E,E,E,F,F,E,E,E,E,B,B,E,E,B,B,E,E,E],
    [E,E,B,B,E,E,B,B,E,E,E,E,F,F,E,E,E,E,B,B,E,E,B,B,E,E,E],
    [E,E,B,B,E,E,B,B,E,E,E,E,F,F,E,E,E,E,B,B,E,E,B,B,E,E,E],
    [E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E],
    [E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E],
    [E,E,B,B,E,E,B,B,E,E,W,W,E,E,W,W,E,E,B,B,E,E,B,B,E,E,E],
    [E,E,B,B,E,E,B,B,E,E,W,W,E,E,W,W,E,E,B,B,E,E,B,B,E,E,E],
    [E,E,B,B,E,E,B,B,E,E,W,W,E,E,W,W,E,E,B,B,E,E,B,B,E,E,E],
    [E,E,B,B,E,E,B,B,E,E,W,W,E,E,W,W,E,E,B,B,E,E,B,B,E,E,E],
    [E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E],
    [E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E],
    [E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E],
    [E,E,E,E,E,E,E,E,E,E,E,E,X,X,E,E,E,E,E,E,E,E,E,E,E,E,E],
    [E,E,E,E,E,E,E,E,E,E,E,E,X,X,E,E,E,E,E,E,E,E,E,E,E,E,E],
    [E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E,E],
];

export interface MapData {
    tiles: CellMap;
    tileSize: number;
}

export function createTestMap(): MapData {
    const clonedTiles = map.map(row => row.map(cell => ({
        type: cell.type,
        properties: { ...cell.properties }
    })));
    return {
        tiles: clonedTiles,
        tileSize: TILE_SIZE,
    };
}

export function getMapDimensions() {
    return {
        width: map[0].length * TILE_SIZE,
        height: map.length * TILE_SIZE,
        tileSize: TILE_SIZE,
        cols: map[0].length,
        rows: map.length,
    };
}
