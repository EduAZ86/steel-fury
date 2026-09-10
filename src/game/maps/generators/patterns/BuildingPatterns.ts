import { CellType } from "../../types";

export interface PatternTile {
    dx: number;
    dy: number;
    type: CellType;
}

export type Pattern = PatternTile[];

export const BUILDING_PATTERNS: Pattern[] = [
    // Square 2x2 brick
    [
        { dx: 0, dy: 0, type: 'brick' },
        { dx: 1, dy: 0, type: 'brick' },
        { dx: 0, dy: 1, type: 'brick' },
        { dx: 1, dy: 1, type: 'brick' },
    ],
    // L-shape brick
    [
        { dx: 0, dy: 0, type: 'brick' },
        { dx: 0, dy: 1, type: 'brick' },
        { dx: 0, dy: 2, type: 'brick' },
        { dx: 1, dy: 2, type: 'brick' },
    ],
    // Concrete T-shape
    [
        { dx: 0, dy: 0, type: 'concrete' },
        { dx: 1, dy: 0, type: 'concrete' },
        { dx: 2, dy: 0, type: 'concrete' },
        { dx: 1, dy: 1, type: 'concrete' },
    ],
    // Room: hardwall frame, reinforced center
    [
        { dx: 0, dy: 0, type: 'hardwall' },
        { dx: 1, dy: 0, type: 'hardwall' },
        { dx: 2, dy: 0, type: 'hardwall' },
        { dx: 0, dy: 1, type: 'hardwall' },
        { dx: 2, dy: 1, type: 'hardwall' },
        { dx: 0, dy: 2, type: 'hardwall' },
        { dx: 1, dy: 2, type: 'hardwall' },
        { dx: 2, dy: 2, type: 'hardwall' },
        { dx: 1, dy: 1, type: 'reinforced' },
    ],
    // Metal corridor
    [
        { dx: 0, dy: 0, type: 'metal' },
        { dx: 1, dy: 0, type: 'metal' },
        { dx: 2, dy: 0, type: 'metal' },
        { dx: 3, dy: 0, type: 'metal' },
    ],
    // U-shape: reinforced + concrete
    [
        { dx: 0, dy: 0, type: 'reinforced' },
        { dx: 1, dy: 0, type: 'concrete' },
        { dx: 2, dy: 0, type: 'reinforced' },
        { dx: 0, dy: 1, type: 'reinforced' },
        { dx: 2, dy: 1, type: 'reinforced' },
    ],
    // Steel corridor with obsidian
    [
        { dx: 0, dy: 0, type: 'steel' },
        { dx: 1, dy: 0, type: 'steel' },
        { dx: 2, dy: 0, type: 'steel' },
        { dx: 3, dy: 0, type: 'steel' },
        { dx: 0, dy: 1, type: 'obsidian' },
        { dx: 3, dy: 1, type: 'obsidian' },
    ],
    // Obsidian square
    [
        { dx: 0, dy: 0, type: 'obsidian' },
        { dx: 1, dy: 0, type: 'obsidian' },
        { dx: 0, dy: 1, type: 'obsidian' },
        { dx: 1, dy: 1, type: 'obsidian' },
    ],
    // Mixed: concrete + brick cross
    [
        { dx: 1, dy: 0, type: 'concrete' },
        { dx: 0, dy: 1, type: 'brick' },
        { dx: 1, dy: 1, type: 'metal' },
        { dx: 2, dy: 1, type: 'brick' },
        { dx: 1, dy: 2, type: 'concrete' },
    ],
];
