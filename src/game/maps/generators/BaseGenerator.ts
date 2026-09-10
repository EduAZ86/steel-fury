import { CellMap, createCell } from "../types";

export class BaseGenerator {
    private cols: number;
    private rows: number;

    constructor(cols: number, rows: number) {
        this.cols = cols;
        this.rows = rows;
    }

    public generate(map: CellMap): void {
        const centerCol = Math.floor(this.cols / 2);
        const centerRow = Math.floor(this.rows / 2);

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const col = centerCol + dx;
                const row = centerRow + dy;
                map[row][col] = createCell('ground');
            }
        }

        map[centerRow][centerCol] = createCell('base');
    }
}
