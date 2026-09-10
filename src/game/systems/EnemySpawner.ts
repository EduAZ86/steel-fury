import { Vector2D } from "@/engine/core/EntitySystem/geometry/Vector2D";
import { Tank } from "../entities/Tank";
import { Enemy } from "../entities/enemies/Enemy";
import { EnemyClass } from "../entities/enemies/types";

export class EnemySpawner {
    public enemies: Enemy[] = [];

    private maxCount: number;
    private spawnInterval: number;
    private spawnTimer = 0;
    private mapBounds: { cols: number; rows: number; tileSize: number };
    private enemyClasses: EnemyClass[] = [
        "scout",
        "grunt",
        "heavy",
        "artillery",
        "commander",
    ];

    constructor(
        maxCount: number,
        spawnInterval: number,
        mapBounds: { cols: number; rows: number; tileSize: number }
    ) {
        this.maxCount = maxCount;
        this.spawnInterval = spawnInterval;
        this.mapBounds = mapBounds;
    }

    public update(
        deltaTime: number,
        tankPosition: Vector2D,
        canMoveTo: (x: number, y: number) => boolean
    ) {
        if (this.enemies.length >= this.maxCount) return;

        this.spawnTimer += deltaTime;
        if (this.spawnTimer < this.spawnInterval) return;

        this.spawnTimer = 0;

        const spawnPositions = this.getSpawnPositions(tankPosition, canMoveTo);
        if (spawnPositions.length === 0) return;

        const pos =
            spawnPositions[Math.floor(Math.random() * spawnPositions.length)];
        const enemyClass =
            this.enemyClasses[
                Math.floor(Math.random() * this.enemyClasses.length)
            ];

        this.enemies.push(new Enemy(pos, enemyClass, this.mapBounds));
    }

    private getSpawnPositions(
        tankPosition: Vector2D,
        canMoveTo: (x: number, y: number) => boolean
    ): Vector2D[] {
        const positions: Vector2D[] = [];
        const ts = this.mapBounds.tileSize;
        const half = ts / 2;

        const spawnPoints = [
            { col: 1, row: 1 },
            { col: this.mapBounds.cols - 2, row: 1 },
            { col: 1, row: this.mapBounds.rows - 2 },
            { col: this.mapBounds.cols - 2, row: this.mapBounds.rows - 2 },
            { col: Math.floor(this.mapBounds.cols / 2), row: 1 },
        ];

        for (const point of spawnPoints) {
            const x = point.col * ts + half;
            const y = point.row * ts + half;

            const distToTank = Math.sqrt(
                Math.pow(x - tankPosition.x, 2) +
                    Math.pow(y - tankPosition.y, 2)
            );

            if (distToTank > ts * 5 && canMoveTo(x, y)) {
                positions.push(new Vector2D(x, y));
            }
        }

        return positions;
    }

    public cleanup() {
        this.enemies = this.enemies.filter((e) => e.isAlive);
    }
}
