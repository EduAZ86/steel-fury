import { ArrowSpaceEnterEscKeys } from "@/engine/core/Input/ArrowSpaceEnterKeys";
import { MapData } from "@/engine/core/Render/render";
import { Direction, Tank, TankConfig } from "./tank";
import { Bullet, BulletConfig } from "./bullet";
import { Vector2D } from "@/engine/core/EntitySystem/geometry/Vector2D";
import { tileType } from "@/engine/core/Render/types";

export interface GameConfig {
    tank: TankConfig;
    bullet: BulletConfig;
}

const DESTROYABLE_TILES: tileType[] = ['brick', 'water', 'forest'];
const SOLID_TILES: tileType[] = ['brick', 'steel', 'water', 'base'];

export class GameManager {
    public tank: Tank;
    public bullets: Bullet[] = [];
    public mapData: MapData;

    private keys: ArrowSpaceEnterEscKeys;
    private config: GameConfig;
    private mapBounds: { cols: number; rows: number; tileSize: number };

    constructor(mapData: MapData, config: GameConfig) {
        this.mapData = mapData;
        this.config = config;
        this.keys = new ArrowSpaceEnterEscKeys();
        this.keys.getKeys();

        this.mapBounds = {
            cols: mapData.tiles[0].length,
            rows: mapData.tiles.length,
            tileSize: mapData.tileSize,
        };

        const spawnX = Math.floor(this.mapBounds.cols / 2) * mapData.tileSize + mapData.tileSize / 2;
        const spawnY = (this.mapBounds.rows - 4) * mapData.tileSize + mapData.tileSize / 2;

        this.tank = new Tank(
            'playerTank',
            new Vector2D(spawnX, spawnY),
            config.tank,
            this.mapBounds
        );
    }

    public update(deltaTime: number) {
        this.handleInput(deltaTime);
        this.tank.updateShootCooldown(deltaTime);
        this.updateBullets(deltaTime);
        this.checkBulletMapCollisions();
        this.checkBulletTankCollisions();
        this.cleanupBullets();
    }

    private handleInput(deltaTime: number) {
        const keyState = this.keys.keysStatus;
        let moving = false;

        const canMove = (x: number, y: number) => this.canTankMoveTo(x, y);

        if (keyState.arrowUp) {
            this.tank.move('up', deltaTime, canMove);
            moving = true;
        } else if (keyState.arrowDown) {
            this.tank.move('down', deltaTime, canMove);
            moving = true;
        } else if (keyState.arrowLeft) {
            this.tank.move('left', deltaTime, canMove);
            moving = true;
        } else if (keyState.arrowRight) {
            this.tank.move('right', deltaTime, canMove);
            moving = true;
        }

        if (!moving) {
            this.tank.stopMoving();
        }

        if (keyState.space || keyState.enter) {
            this.shoot();
        }
    }

    private canTankMoveTo(x: number, y: number): boolean {
        const half = this.config.tank.tankSize / 2;
        const ts = this.mapBounds.tileSize;

        const minCol = Math.floor((x - half) / ts);
        const maxCol = Math.floor((x + half - 1) / ts);
        const minRow = Math.floor((y - half) / ts);
        const maxRow = Math.floor((y + half - 1) / ts);

        for (let row = minRow; row <= maxRow; row++) {
            for (let col = minCol; col <= maxCol; col++) {
                if (row < 0 || row >= this.mapBounds.rows || col < 0 || col >= this.mapBounds.cols) {
                    return false;
                }
                const tile = this.mapData.tiles[row][col];
                if (SOLID_TILES.includes(tile)) {
                    return false;
                }
            }
        }
        return true;
    }

    private shoot() {
        const bulletInfo = this.tank.tryShoot();
        if (!bulletInfo) return;

        const bullet = new Bullet(
            new Vector2D(bulletInfo.x, bulletInfo.y),
            bulletInfo.direction,
            this.config.bullet,
            this.mapBounds
        );

        this.bullets.push(bullet);
    }

    private updateBullets(deltaTime: number) {
        for (const bullet of this.bullets) {
            bullet.update(deltaTime);
        }
    }

    private checkBulletMapCollisions() {
        for (const bullet of this.bullets) {
            if (!bullet.isAlive) continue;

            const tileX = bullet.tileX;
            const tileY = bullet.tileY;

            if (tileX < 0 || tileX >= this.mapBounds.cols ||
                tileY < 0 || tileY >= this.mapBounds.rows) {
                bullet.destroy();
                continue;
            }

            const tile = this.mapData.tiles[tileY][tileX];

            if (tile === 'base') {
                bullet.destroy();
                continue;
            }

            if (DESTROYABLE_TILES.includes(tile)) {
                this.destroyTile(tileX, tileY);
                bullet.destroy();
                continue;
            }

            if (tile === 'steel') {
                bullet.destroy();
                continue;
            }
        }
    }

    private destroyTile(x: number, y: number) {
        this.mapData.tiles[y][x] = 'empty';

        const neighbors = [
            [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1],
        ];

        for (const [nx, ny] of neighbors) {
            if (nx >= 0 && nx < this.mapBounds.cols && ny >= 0 && ny < this.mapBounds.rows) {
                const neighbor = this.mapData.tiles[ny][nx];
                if (neighbor === 'water' || neighbor === 'forest') {
                    this.mapData.tiles[ny][nx] = 'empty';
                }
            }
        }
    }

    private checkBulletTankCollisions() {
        for (const bullet of this.bullets) {
            if (!bullet.isAlive) continue;

            const bx = bullet.position.x;
            const by = bullet.position.y;
            const bSize = this.config.bullet.size;

            const tx = this.tank.position.x;
            const ty = this.tank.position.y;
            const tSize = this.config.tank.tankSize;

            if (Math.abs(bx - tx) < (bSize + tSize) / 2 &&
                Math.abs(by - ty) < (bSize + tSize) / 2) {
                bullet.destroy();
            }
        }
    }

    private cleanupBullets() {
        this.bullets = this.bullets.filter(b => b.isAlive);
    }

    public destroy() {
        this.keys.stopTracking();
    }
}
