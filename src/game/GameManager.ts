import { Inputs, keys } from "@/engine";
import { Vector2D } from "@/engine/core/EntitySystem/geometry/Vector2D";
import { Tank, TankConfig } from "./entities/Tank";
import { Bullet, BulletConfig, BULLET_TYPES } from "./entities/Bullet";
import { Enemy, EnemyClass, ENEMY_CONFIGS } from "./entities/Enemy";
import { MapData } from "./maps/testMap";
import { Cell } from "./maps/types";

export interface GameConfig {
    tank: TankConfig;
    bullet: BulletConfig;
    enemies: {
        maxCount: number;
        spawnInterval: number;
    };
}

export class GameManager {
    public tank: Tank;
    public bullets: Bullet[] = [];
    public enemies: Enemy[] = [];
    public mapData: MapData;
    public currentBulletType: string = 'medium';

    private input: Inputs;
    private config: GameConfig;
    private mapBounds: { cols: number; rows: number; tileSize: number };
    private spawnTimer: number = 0;
    private enemyClasses: EnemyClass[] = ['scout', 'grunt', 'heavy', 'artillery', 'commander'];

    constructor(mapData: MapData, config: GameConfig) {
        this.mapData = mapData;
        this.config = config;
        this.input = new Inputs(['Keyboard']);
        this.input.startTracking();

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
        const dt = deltaTime / 1000;
        const inputData = this.input.getDataInputs;
        const keyState = inputData?.[0] as keys | undefined;
        if (!keyState) return;

        let moved = false;

        if (keyState.arrowLeft) {
            this.tank.rotate(-this.config.tank.rotationSpeed * dt);
        }
        if (keyState.arrowRight) {
            this.tank.rotate(this.config.tank.rotationSpeed * dt);
        }

        if (keyState.arrowUp) {
            this.tank.moveForward(dt);
            moved = true;
        } else if (keyState.arrowDown) {
            this.tank.moveBackward(dt);
            moved = true;
        }

        if (!moved) {
            this.tank.applyFriction(dt);
        }

        const speedMod = this.getSpeedModifierAt(this.tank.position.x, this.tank.position.y);
        this.tank.applyVelocity(dt, speedMod, (x, y) => this.canTankMoveTo(x, y));

        this.tank.updateShootCooldown(deltaTime);

        if (keyState.space || keyState.enter) {
            this.shoot();
        }

        if (keyState.key1) this.currentBulletType = 'light';
        if (keyState.key2) this.currentBulletType = 'medium';
        if (keyState.key3) this.currentBulletType = 'heavy';
        if (keyState.key4) this.currentBulletType = 'explosive';

        this.updateEnemies(deltaTime);
        this.spawnEnemies(deltaTime);
        this.enemyShoot();
        this.updateBullets(deltaTime);
        this.checkBulletMapCollisions();
        this.checkBulletTankCollisions();
        this.checkBulletEnemyCollisions();
        this.checkEnemyTankCollisions();
        this.cleanupBullets();
        this.cleanupEnemies();
    }

    private spawnEnemies(deltaTime: number) {
        if (this.enemies.length >= this.config.enemies.maxCount) return;

        this.spawnTimer += deltaTime;
        if (this.spawnTimer < this.config.enemies.spawnInterval) return;

        this.spawnTimer = 0;

        const spawnPositions = this.getSpawnPositions();
        if (spawnPositions.length === 0) return;

        const pos = spawnPositions[Math.floor(Math.random() * spawnPositions.length)];
        const enemyClass = this.enemyClasses[Math.floor(Math.random() * this.enemyClasses.length)];

        const enemy = new Enemy(pos, enemyClass, this.mapBounds);
        this.enemies.push(enemy);
    }

    private getSpawnPositions(): Vector2D[] {
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
                Math.pow(x - this.tank.position.x, 2) +
                Math.pow(y - this.tank.position.y, 2)
            );

            if (distToTank > ts * 5 && this.canEnemyMoveTo(x, y)) {
                positions.push(new Vector2D(x, y));
            }
        }

        return positions;
    }

    private updateEnemies(deltaTime: number) {
        for (const enemy of this.enemies) {
            const speedMod = this.getSpeedModifierAt(enemy.position.x, enemy.position.y);
            enemy.update(deltaTime, this.tank.position, (x, y) => this.canEnemyMoveTo(x, y), speedMod);
        }
    }

    private enemyShoot() {
        for (const enemy of this.enemies) {
            const bulletInfo = enemy.tryShoot();
            if (!bulletInfo) continue;

            const bullet = new Bullet(
                new Vector2D(bulletInfo.x, bulletInfo.y),
                bulletInfo.angle,
                enemy.config.bulletConfig,
                this.mapBounds
            );

            this.bullets.push(bullet);
        }
    }

    private canEnemyMoveTo(x: number, y: number): boolean {
        const ts = this.mapBounds.tileSize;
        const half = 16;

        const minCol = Math.floor((x - half) / ts);
        const maxCol = Math.floor((x + half - 1) / ts);
        const minRow = Math.floor((y - half) / ts);
        const maxRow = Math.floor((y + half - 1) / ts);

        for (let row = minRow; row <= maxRow; row++) {
            for (let col = minCol; col <= maxCol; col++) {
                if (row < 0 || row >= this.mapBounds.rows || col < 0 || col >= this.mapBounds.cols) {
                    return false;
                }
                const cell = this.mapData.tiles[row][col];
                if (cell.properties.isObstacle) {
                    return false;
                }
            }
        }
        return true;
    }

    public getSpeedModifierAt(x: number, y: number): number {
        const col = Math.floor(x / this.mapBounds.tileSize);
        const row = Math.floor(y / this.mapBounds.tileSize);
        if (row < 0 || row >= this.mapBounds.rows || col < 0 || col >= this.mapBounds.cols) return 0;
        return this.mapData.tiles[row][col].properties.speedModifier;
    }

    public getCellAt(x: number, y: number): Cell | null {
        const col = Math.floor(x / this.mapBounds.tileSize);
        const row = Math.floor(y / this.mapBounds.tileSize);
        if (row < 0 || row >= this.mapBounds.rows || col < 0 || col >= this.mapBounds.cols) return null;
        return this.mapData.tiles[row][col];
    }

    public canTankMoveTo(x: number, y: number): boolean {
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
                const cell = this.mapData.tiles[row][col];
                if (cell.properties.isObstacle) {
                    return false;
                }
            }
        }
        return true;
    }

    private shoot() {
        const bulletConfig = BULLET_TYPES[this.currentBulletType] || this.config.bullet;
        const bulletInfo = this.tank.tryShoot(bulletConfig.size);
        if (!bulletInfo) return;

        const bullet = new Bullet(
            new Vector2D(bulletInfo.x, bulletInfo.y),
            bulletInfo.angle,
            bulletConfig,
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

            const cell = this.mapData.tiles[tileY][tileX];

            if (cell.properties.passThrough) continue;

            if (cell.properties.hardness === -1) {
                bullet.destroy();
                continue;
            }

            if (cell.properties.hardness > 0) {
                cell.properties.hardness -= bullet.damage;
                if (cell.properties.hardness <= 0) {
                    this.destroyTile(tileX, tileY);
                }
                bullet.destroy();
                continue;
            }

            bullet.destroy();
        }
    }

    private destroyTile(x: number, y: number) {
        this.mapData.tiles[y][x] = {
            type: 'empty',
            properties: {
                color: '#1a1a2e',
                hardness: 0,
                speedModifier: 1.0,
                passThrough: true,
                isObstacle: false,
                isGround: false,
            },
        };

        const neighbors = [
            [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1],
        ];

        for (const [nx, ny] of neighbors) {
            if (nx >= 0 && nx < this.mapBounds.cols && ny >= 0 && ny < this.mapBounds.rows) {
                const neighbor = this.mapData.tiles[ny][nx];
                if (neighbor.type === 'water' || neighbor.type === 'forest') {
                    this.mapData.tiles[ny][nx] = {
                        type: 'empty',
                        properties: {
                            color: '#1a1a2e',
                            hardness: 0,
                            speedModifier: 1.0,
                            passThrough: true,
                            isObstacle: false,
                            isGround: false,
                        },
                    };
                }
            }
        }
    }

    private checkBulletTankCollisions() {
        for (const bullet of this.bullets) {
            if (!bullet.isAlive) continue;

            const bx = bullet.position.x;
            const by = bullet.position.y;
            const bSize = bullet.config.size;

            const tx = this.tank.position.x;
            const ty = this.tank.position.y;
            const tSize = this.config.tank.tankSize;

            if (Math.abs(bx - tx) < (bSize + tSize) / 2 &&
                Math.abs(by - ty) < (bSize + tSize) / 2) {
                bullet.destroy();
                this.tank.health -= bullet.damage;
            }
        }
    }

    private checkBulletEnemyCollisions() {
        for (const bullet of this.bullets) {
            if (!bullet.isAlive) continue;

            for (const enemy of this.enemies) {
                if (!enemy.isAlive) continue;

                const bx = bullet.position.x;
                const by = bullet.position.y;
                const bSize = bullet.config.size;

                const ex = enemy.position.x;
                const ey = enemy.position.y;
                const eSize = enemy.config.size;

                if (Math.abs(bx - ex) < (bSize + eSize) / 2 &&
                    Math.abs(by - ey) < (bSize + eSize) / 2) {
                    bullet.destroy();
                    enemy.takeDamage(bullet.damage);
                }
            }
        }
    }

    private checkEnemyTankCollisions() {
        for (const enemy of this.enemies) {
            if (!enemy.isAlive) continue;

            const ex = enemy.position.x;
            const ey = enemy.position.y;
            const eSize = enemy.config.size;

            const tx = this.tank.position.x;
            const ty = this.tank.position.y;
            const tSize = this.config.tank.tankSize;

            if (Math.abs(ex - tx) < (eSize + tSize) / 2 &&
                Math.abs(ey - ty) < (eSize + tSize) / 2) {
                this.tank.health -= 10;
            }
        }
    }

    private cleanupBullets() {
        this.bullets = this.bullets.filter(b => b.isAlive);
    }

    private cleanupEnemies() {
        this.enemies = this.enemies.filter(e => e.isAlive);
    }

    public destroy() {
        this.input.stopTracking();
    }
}
