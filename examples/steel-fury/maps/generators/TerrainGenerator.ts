import { CellMap, createCell } from "../types";
import { SeededRandom } from "./SeededRandom";
import { FOREST_SHAPES } from "./patterns/TerrainPatterns";

export class TerrainGenerator {
    private cols: number;
    private rows: number;
    private rng: SeededRandom;

    constructor(cols: number, rows: number, rng: SeededRandom) {
        this.cols = cols;
        this.rows = rows;
        this.rng = rng;
    }

    public generate(map: CellMap): void {
        this.placeClusters(map, 'water', 0.06, FOREST_SHAPES);
        this.placeClusters(map, 'forest', 0.10, FOREST_SHAPES);
    }

    private placeClusters(
        map: CellMap,
        type: 'water' | 'forest',
        density: number,
        shapes: number[][][]
    ): void {
        const totalTiles = this.cols * this.rows;
        const targetTiles = Math.floor(totalTiles * density);
        let placed = 0;

        while (placed < targetTiles) {
            const shape = this.rng.pick(shapes);
            const startCol = this.rng.nextInt(1, this.cols - shape[0].length - 1);
            const startRow = this.rng.nextInt(1, this.rows - shape.length - 1);

            for (let dy = 0; dy < shape.length; dy++) {
                for (let dx = 0; dx < shape[dy].length; dx++) {
                    if (shape[dy][dx] === 0) continue;

                    const col = startCol + dx;
                    const row = startRow + dy;

                    if (!this.isInBounds(col, row)) continue;
                    if (this.isReservedZone(col, row)) continue;
                    if (map[row][col].type !== 'ground') continue;

                    map[row][col] = createCell(type);
                    placed++;
                }
            }
        }
    }

    private isInBounds(col: number, row: number): boolean {
        return col > 0 && col < this.cols - 1 && row > 0 && row < this.rows - 1;
    }

    private isReservedZone(col: number, row: number): boolean {
        const centerCol = Math.floor(this.cols / 2);
        const centerRow = Math.floor(this.rows / 2);
        return (
            Math.abs(col - centerCol) < 3 &&
            Math.abs(row - centerRow) < 3
        );
    }
}
