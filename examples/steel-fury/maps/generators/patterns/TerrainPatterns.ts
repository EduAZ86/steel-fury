export type TerrainShape = number[][];

export const WATER_SHAPES: TerrainShape[] = [
    [[0, 1, 0], [1, 1, 1], [0, 1, 0]],
    [[1, 1], [1, 1]],
    [[0, 1, 1], [1, 1, 0], [1, 1, 1]],
    [[1, 1, 1], [1, 1, 1]],
    [[0, 1], [1, 1], [1, 0]],
];

export const FOREST_SHAPES: TerrainShape[] = [
    [[1, 1], [1, 1]],
    [[1, 0], [1, 0], [1, 1]],
    [[0, 1, 0], [1, 1, 1]],
    [[1, 1, 1], [0, 1, 0]],
    [[1, 1], [0, 1], [1, 1]],
];
