import { CellType as RawCellType, CELL_TYPES as RAW_CELL_TYPES } from "./cellSettings";

export type CellType = RawCellType;
export const CELL_TYPES = RAW_CELL_TYPES;

export interface CellProperties {
    color: string;
    hardness: number;
    speedModifier: number;
    passThrough: boolean;
    isObstacle: boolean;
    isGround: boolean;
}

export interface Cell {
    type: CellType;
    properties: CellProperties;
    isDamaged: boolean;
}

export type CellMap = Cell[][];

export function createCell(type: CellType): Cell {
    const config = CELL_TYPES[type];
    return {
        type,
        properties: { ...config },
        isDamaged: false,
    };
}
