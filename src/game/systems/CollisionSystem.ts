import { Vector2D } from "@/engine/core/EntitySystem/geometry/Vector2D";
import { Tank } from "../entities/Tank";
import { Bullet } from "../entities/Bullet";
import { Enemy } from "../entities/enemies/Enemy";
import { MapData } from "../maps/testMap";
import { CellType, createCell } from "../maps/types";
import { CELL_TYPES } from "../maps/cellSettings";

export class CollisionSystem {
    private mapBounds: { cols: number; rows: number; tileSize: number };

    constructor(mapBounds: { cols: number; rows: number; tileSize: number }) {
        this.mapBounds = mapBounds;
    }

    public resolveAll(
        bullets: Bullet[],
        enemies: Enemy[],
        tank: Tank,
        tankSize: number,
        mapData: MapData,
        onEnemyDamage?: (enemy: Enemy, damage: number) => void
    ): boolean {
        const baseDestroyed = this.checkBulletMapCollisions(bullets, mapData);
        this.checkBulletTankCollisions(bullets, tank, tankSize);
        this.checkBulletEnemyCollisions(
            bullets,
            enemies,
            tankSize,
            onEnemyDamage
        );
        this.resolveEntityCollisions(enemies, tank, tankSize);
        return baseDestroyed;
    }

    private checkBulletMapCollisions(bullets: Bullet[], mapData: MapData): boolean {
        let baseDestroyed = false;

        for (const bullet of bullets) {
            if (!bullet.isAlive) continue;

            const tileX = bullet.tileX;
            const tileY = bullet.tileY;

            if (
                tileX < 0 ||
                tileX >= this.mapBounds.cols ||
                tileY < 0 ||
                tileY >= this.mapBounds.rows
            ) {
                bullet.destroy();
                continue;
            }

            const cell = mapData.tiles[tileY][tileX];

            if (cell.properties.passThrough) continue;

            if (cell.properties.hardness === -1) {
                bullet.destroy();
                continue;
            }

            if (cell.properties.hardness > 0) {
                const cellConfig = CELL_TYPES[cell.type];
                const maxHP = cellConfig?.hardness ?? cell.properties.hardness;
                const currentHardness = cell.properties.hardness;
                const newHardness = currentHardness - bullet.damage;

                if (newHardness <= 0) {
                    if (cell.type === 'base') {
                        baseDestroyed = true;
                    }
                    const destroyedKey = (cellConfig as Record<string, unknown>).destroyedKey as string | undefined;
                    if (destroyedKey) {
                        const destroyedType = destroyedKey as CellType;
                        const destroyedConfig = CELL_TYPES[destroyedType];
                        cell.type = destroyedType;
                        cell.properties = { ...destroyedConfig };
                        cell.isDamaged = true;
                    } else {
                        this.destroyTile(tileX, tileY, mapData);
                    }
                } else {
                    cell.properties.hardness = newHardness;
                    const damageRatio = (maxHP - newHardness) / maxHP;
                    if (damageRatio >= 0.5 && !cell.isDamaged) {
                        const damagedKey = (cellConfig as Record<string, unknown>).damagedKey as string | undefined;
                        if (damagedKey) {
                            const damagedType = damagedKey as CellType;
                            const damagedConfig = CELL_TYPES[damagedType];
                            cell.type = damagedType;
                            cell.properties = { ...damagedConfig, hardness: newHardness };
                            cell.isDamaged = true;
                        }
                    }
                }
                bullet.destroy();
                continue;
            }

            bullet.destroy();
        }

        return baseDestroyed;
    }

    private destroyTile(x: number, y: number, mapData: MapData) {
        mapData.tiles[y][x] = createCell('ground');

        const neighbors = [
            [x - 1, y],
            [x + 1, y],
            [x, y - 1],
            [x, y + 1],
        ];

        for (const [nx, ny] of neighbors) {
            if (
                nx >= 0 &&
                nx < this.mapBounds.cols &&
                ny >= 0 &&
                ny < this.mapBounds.rows
            ) {
                const neighbor = mapData.tiles[ny][nx];
                if (neighbor.type === "water" || neighbor.type === "forest") {
                    mapData.tiles[ny][nx] = createCell('ground');
                }
            }
        }
    }

    private checkBulletTankCollisions(
        bullets: Bullet[],
        tank: Tank,
        tankSize: number
    ) {
        for (const bullet of bullets) {
            if (!bullet.isAlive) continue;

            const bx = bullet.position.x;
            const by = bullet.position.y;
            const bSize = bullet.config.size;

            const tx = tank.position.x;
            const ty = tank.position.y;

            if (
                Math.abs(bx - tx) < (bSize + tankSize) / 2 &&
                Math.abs(by - ty) < (bSize + tankSize) / 2
            ) {
                bullet.destroy();
                tank.health -= bullet.damage;
            }
        }
    }

    private checkBulletEnemyCollisions(
        bullets: Bullet[],
        enemies: Enemy[],
        _tankSize: number,
        onEnemyDamage?: (enemy: Enemy, damage: number) => void
    ) {
        for (const bullet of bullets) {
            if (!bullet.isAlive) continue;

            for (const enemy of enemies) {
                if (!enemy.isAlive) continue;

                const bx = bullet.position.x;
                const by = bullet.position.y;
                const bSize = bullet.config.size;

                const ex = enemy.position.x;
                const ey = enemy.position.y;
                const eSize = enemy.config.size;

                if (
                    Math.abs(bx - ex) < (bSize + eSize) / 2 &&
                    Math.abs(by - ey) < (bSize + eSize) / 2
                ) {
                    bullet.destroy();
                    enemy.takeDamage(bullet.damage);
                    onEnemyDamage?.(enemy, bullet.damage);
                }
            }
        }
    }

    private resolveEntityCollisions(
        enemies: Enemy[],
        tank: Tank,
        tankSize: number
    ) {
        const aliveEnemies = enemies.filter((e) => e.isAlive);
        const all = [
            {
                position: tank.position,
                size: tankSize,
                go: tank.gameObject,
            },
            ...aliveEnemies.map((e) => ({
                position: e.position,
                size: e.config.size,
                go: e.gameObject,
            })),
        ];

        for (let i = 0; i < all.length; i++) {
            for (let j = i + 1; j < all.length; j++) {
                const a = all[i];
                const b = all[j];

                const overlapX =
                    a.size / 2 +
                    b.size / 2 -
                    Math.abs(a.position.x - b.position.x);
                const overlapY =
                    a.size / 2 +
                    b.size / 2 -
                    Math.abs(a.position.y - b.position.y);

                if (overlapX <= 0 || overlapY <= 0) continue;

                const pushX =
                    a.position.x < b.position.x
                        ? -overlapX / 2
                        : overlapX / 2;
                const pushY =
                    a.position.y < b.position.y
                        ? -overlapY / 2
                        : overlapY / 2;

                if (overlapX < overlapY) {
                    a.go.transform.updatePosition({
                        x: a.position.x + pushX,
                        y: a.position.y,
                    });
                    b.go.transform.updatePosition({
                        x: b.position.x - pushX,
                        y: b.position.y,
                    });
                } else {
                    a.go.transform.updatePosition({
                        x: a.position.x,
                        y: a.position.y + pushY,
                    });
                    b.go.transform.updatePosition({
                        x: b.position.x,
                        y: b.position.y - pushY,
                    });
                }
            }
        }
    }

    public canMoveTo(
        x: number,
        y: number,
        halfSize: number,
        mapData: MapData
    ): boolean {
        const ts = this.mapBounds.tileSize;

        const minCol = Math.floor((x - halfSize) / ts);
        const maxCol = Math.floor((x + halfSize - 1) / ts);
        const minRow = Math.floor((y - halfSize) / ts);
        const maxRow = Math.floor((y + halfSize - 1) / ts);

        for (let row = minRow; row <= maxRow; row++) {
            for (let col = minCol; col <= maxCol; col++) {
                if (
                    row < 0 ||
                    row >= this.mapBounds.rows ||
                    col < 0 ||
                    col >= this.mapBounds.cols
                ) {
                    return false;
                }
                const cell = mapData.tiles[row][col];
                if (cell.properties.isObstacle) {
                    return false;
                }
            }
        }
        return true;
    }

    public getSpeedModifierAt(x: number, y: number, mapData: MapData): number {
        const col = Math.floor(x / this.mapBounds.tileSize);
        const row = Math.floor(y / this.mapBounds.tileSize);
        if (
            row < 0 ||
            row >= this.mapBounds.rows ||
            col < 0 ||
            col >= this.mapBounds.cols
        )
            return 0;
        return mapData.tiles[row][col].properties.speedModifier;
    }
}
