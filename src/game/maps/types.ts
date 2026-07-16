export interface CellProperties {
    color: string;
    hardness: number;
    speedModifier: number;
    passThrough: boolean;
    isObstacle: boolean;
    isGround: boolean;
}

export interface Cell {
    type: string;
    properties: CellProperties;
}

export type CellMap = Cell[][];
