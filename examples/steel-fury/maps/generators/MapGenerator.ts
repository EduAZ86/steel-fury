import { CellMap, createCell } from "../types";
import { MapData } from "../testMap";
import { SeededRandom } from "./SeededRandom";
import { TerrainGenerator } from "./TerrainGenerator";
import { StructureGenerator } from "./StructureGenerator";
import { PlayerSpawnGenerator } from "./PlayerSpawnGenerator";

export interface MapConfig {
    seed: number;
    cols: number;
    rows: number;
    tileSize: number;
}

export interface GeneratedMap extends MapData {
    spawnCol: number;
    spawnRow: number;
    baseCol: number;
    baseRow: number;
}

const DEFAULT_CONFIG: MapConfig = {
    seed: Date.now(),
    cols: 50,
    rows: 40,
    tileSize: 32,
};

export class MapGenerator {
    public static generate(config: Partial<MapConfig> = {}): GeneratedMap {
        const cfg = { ...DEFAULT_CONFIG, ...config };
        const rng = new SeededRandom(cfg.seed);
        const map = this.createGroundMap(cfg.cols, cfg.rows);

        const terrainGen = new TerrainGenerator(cfg.cols, cfg.rows, rng);
        terrainGen.generate(map);

        const structureGen = new StructureGenerator(cfg.cols, cfg.rows, rng);
        structureGen.generate(map);

        const spawnGen = new PlayerSpawnGenerator(cfg.cols, cfg.rows);
        const { spawnCol, spawnRow, baseCol, baseRow } = spawnGen.generate(map);

        return {
            tiles: map,
            tileSize: cfg.tileSize,
            spawnCol,
            spawnRow,
            baseCol,
            baseRow,
        };
    }

    private static createGroundMap(cols: number, rows: number): CellMap {
        const map: CellMap = [];
        for (let r = 0; r < rows; r++) {
            const row = [];
            for (let c = 0; c < cols; c++) {
                row.push(createCell('ground'));
            }
            map.push(row);
        }
        return map;
    }
}
