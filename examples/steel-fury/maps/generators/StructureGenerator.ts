import { CellMap, createCell } from "../types";
import { SeededRandom } from "./SeededRandom";
import { BUILDING_PATTERNS, Pattern } from "./patterns/BuildingPatterns";

export class StructureGenerator {
    private cols: number;
    private rows: number;
    private rng: SeededRandom;
    private minStructures: number;
    private maxStructures: number;

    constructor(
        cols: number,
        rows: number,
        rng: SeededRandom,
        minStructures = 5,
        maxStructures = 12
    ) {
        this.cols = cols;
        this.rows = rows;
        this.rng = rng;
        this.minStructures = minStructures;
        this.maxStructures = maxStructures;
    }

    public generate(map: CellMap): void {
        const count = this.rng.nextInt(this.minStructures, this.maxStructures);

        for (let i = 0; i < count; i++) {
            this.placeStructure(map);
        }
    }

    private placeStructure(map: CellMap): void {
        const pattern = this.rng.pick(BUILDING_PATTERNS);
        const maxAttempts = 20;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const startCol = this.rng.nextInt(2, this.cols - this.getMaxDx(pattern) - 2);
            const startRow = this.rng.nextInt(2, this.rows - this.getMaxDy(pattern) - 2);

            if (this.canPlace(map, pattern, startRow, startCol)) {
                this.placePattern(map, pattern, startRow, startCol);
                return;
            }
        }
    }

    private canPlace(
        map: CellMap,
        pattern: Pattern,
        startRow: number,
        startCol: number
    ): boolean {
        for (const tile of pattern) {
            const col = startCol + tile.dx;
            const row = startRow + tile.dy;

            if (col < 1 || col >= this.cols - 1 || row < 1 || row >= this.rows - 1) {
                return false;
            }

            if (!this.isReservedZone(col, row)) return false;

            const cell = map[row][col];
            if (cell.type !== 'ground') return false;
        }
        return true;
    }

    private placePattern(
        map: CellMap,
        pattern: Pattern,
        startRow: number,
        startCol: number
    ): void {
        for (const tile of pattern) {
            const col = startCol + tile.dx;
            const row = startRow + tile.dy;
            map[row][col] = createCell(tile.type);
        }
    }

    private isReservedZone(col: number, row: number): boolean {
        const centerCol = Math.floor(this.cols / 2);
        const centerRow = Math.floor(this.rows / 2);
        return (
            Math.abs(col - centerCol) > 3 ||
            Math.abs(row - centerRow) > 3
        );
    }

    private getMaxDx(pattern: Pattern): number {
        return Math.max(...pattern.map((t) => t.dx)) + 1;
    }

    private getMaxDy(pattern: Pattern): number {
        return Math.max(...pattern.map((t) => t.dy)) + 1;
    }
}
