import { Vector2D } from "@/engine/core/EntitySystem/geometry/Vector2D";
import { Tank, TankConfig } from "./entities/Tank";
import { Bullet, BulletConfig } from "./entities/Bullet";
import { Enemy } from "./entities/enemies/Enemy";
import { GeneratedMap } from "./maps/generators/MapGenerator";
import { PlayerController } from "./systems/PlayerController";
import { EnemySpawner } from "./systems/EnemySpawner";
import { CollisionSystem } from "./systems/CollisionSystem";
import { GameState } from "./systems/GameState";

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
    public mapData: GeneratedMap;

    private config: GameConfig;
    private mapBounds: { cols: number; rows: number; tileSize: number };

    private playerController: PlayerController;
    private enemySpawner: EnemySpawner;
    private collisionSystem: CollisionSystem;
    private gameState: GameState;

    constructor(mapData: GeneratedMap, config: GameConfig) {
        this.mapData = mapData;
        this.config = config;

        this.mapBounds = {
            cols: mapData.tiles[0].length,
            rows: mapData.tiles.length,
            tileSize: mapData.tileSize,
        };

        const spawnX = mapData.spawnCol * mapData.tileSize + mapData.tileSize / 2;
        const spawnY = mapData.spawnRow * mapData.tileSize + mapData.tileSize / 2;

        this.tank = new Tank(
            "playerTank",
            new Vector2D(spawnX, spawnY),
            config.tank,
            this.mapBounds
        );

        this.playerController = new PlayerController(
            this.tank,
            config.tank,
            this.mapBounds
        );

        this.enemySpawner = new EnemySpawner(
            config.enemies.maxCount,
            config.enemies.spawnInterval,
            this.mapBounds
        );

        this.collisionSystem = new CollisionSystem(this.mapBounds);
        this.gameState = new GameState();
    }

    public update(deltaTime: number) {
        if (this.gameState.isGameOver) return;

        const canMoveTo = (x: number, y: number) =>
            this.collisionSystem.canMoveTo(
                x,
                y,
                this.config.tank.tankSize / 2,
                this.mapData
            );

        const speedMod = this.collisionSystem.getSpeedModifierAt(
            this.tank.position.x,
            this.tank.position.y,
            this.mapData
        );

        const newBullet = this.playerController.update(
            deltaTime,
            speedMod,
            canMoveTo
        );
        if (newBullet) this.bullets.push(newBullet);

        this.enemySpawner.update(
            deltaTime,
            this.tank.position,
            (x, y) =>
                this.collisionSystem.canMoveTo(x, y, 16, this.mapData)
        );

        this.updateEnemyAI(deltaTime);
        this.enemyShoot();

        for (const bullet of this.bullets) {
            bullet.update(deltaTime);
        }

        const baseDestroyed = this.collisionSystem.resolveAll(
            this.bullets,
            this.enemySpawner.enemies,
            this.tank,
            this.config.tank.tankSize,
            this.mapData,
            (_enemy, damage) => {
                this.gameState.addScore(damage);
            }
        );

        this.bullets = this.bullets.filter((b) => b.isAlive);
        this.enemySpawner.cleanup();

        const baseReached = this.checkEnemyBaseCollision();
        this.gameState.checkGameOver(this.tank.health, baseDestroyed || baseReached);
    }

    private updateEnemyAI(deltaTime: number) {
        const basePos = new Vector2D(
            this.mapData.baseCol * this.mapData.tileSize + this.mapData.tileSize / 2,
            this.mapData.baseRow * this.mapData.tileSize + this.mapData.tileSize / 2
        );

        for (const enemy of this.enemySpawner.enemies) {
            const speedMod = this.collisionSystem.getSpeedModifierAt(
                enemy.position.x,
                enemy.position.y,
                this.mapData
            );
            enemy.update(
                deltaTime,
                this.tank.position,
                basePos,
                (x, y) =>
                    this.collisionSystem.canMoveTo(x, y, 16, this.mapData),
                speedMod
            );
        }
    }

    private enemyShoot() {
        for (const enemy of this.enemySpawner.enemies) {
            const bulletInfo = enemy.tryShoot();
            if (!bulletInfo) continue;

            this.bullets.push(
                new Bullet(
                    new Vector2D(bulletInfo.x, bulletInfo.y),
                    bulletInfo.angle,
                    enemy.config.bulletConfig,
                    this.mapBounds
                )
            );
        }
    }

    private checkEnemyBaseCollision(): boolean {
        const baseX = this.mapData.baseCol * this.mapData.tileSize + this.mapData.tileSize / 2;
        const baseY = this.mapData.baseRow * this.mapData.tileSize + this.mapData.tileSize / 2;
        const threshold = this.mapData.tileSize * 1.5;

        for (const enemy of this.enemySpawner.enemies) {
            if (!enemy.isAlive) continue;
            if (
                Math.abs(enemy.position.x - baseX) < threshold &&
                Math.abs(enemy.position.y - baseY) < threshold
            ) {
                return true;
            }
        }
        return false;
    }

    public get score(): number {
        return this.gameState.score;
    }

    public get isGameOver(): boolean {
        return this.gameState.isGameOver;
    }

    public get enemies(): Enemy[] {
        return this.enemySpawner.enemies;
    }

    public destroy() {
        this.playerController.destroy();
    }
}
