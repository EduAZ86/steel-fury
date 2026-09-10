import { CellMap, createCell } from "../types";

export class PlayerSpawnGenerator {
    private cols: number;
    private rows: number;

    constructor(cols: number, rows: number) {
        this.cols = cols;
        this.rows = rows;
    }

    public generate(map: CellMap): { spawnCol: number; spawnRow: number; baseCol: number; baseRow: number } {
        const centerCol = Math.floor(this.cols / 2);
        const spawnRow = this.rows - 3;

        this.clearArea(map, centerCol, spawnRow);
        this.placeWalls(map, centerCol, spawnRow);
        this.placeBase(map, centerCol, spawnRow);

        return {
            spawnCol: centerCol - 2,
            spawnRow: spawnRow + 1,
            baseCol: centerCol + 1,
            baseRow: spawnRow + 1,
        };
    }

    private clearArea(map: CellMap, centerCol: number, startRow: number): void {
        for (let dy = 0; dy < 3; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
                const col = centerCol + dx;
                const row = startRow + dy;
                if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
                    map[row][col] = createCell('ground');
                }
            }
        }
    }

    private placeWalls(map: CellMap, centerCol: number, startRow: number): void {
        const wallPositions = [
            [0, 0], [1, 0], [2, 0],
            [0, 1], [2, 1],
            [0, 2], [1, 2], [2, 2],
        ];

        for (const [dx, dy] of wallPositions) {
            const col = centerCol + dx;
            const row = startRow + dy;
            if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
                map[row][col] = createCell('hardwall');
            }
        }
    }

    private placeBase(map: CellMap, centerCol: number, startRow: number): void {
        const baseCol = centerCol + 1;
        const baseRow = startRow + 1;
        if (baseCol >= 0 && baseCol < this.cols && baseRow >= 0 && baseRow < this.rows) {
            map[baseRow][baseCol] = createCell('base');
        }
    }
}
