import { Cell, CellMap, createCell } from "./types";

const TILE_SIZE = 32;

const E: Cell = createCell('ground');
const B: Cell = createCell('brick');
const S: Cell = createCell('steel');
const W: Cell = createCell('water');
const F: Cell = createCell('forest');
const X: Cell = createCell('base');

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
        properties: { ...cell.properties },
        isDamaged: false,
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
