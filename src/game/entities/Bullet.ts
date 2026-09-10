import { Entity } from "@/engine/core/EntitySystem/Entity";
import { GameObject } from "@/engine/core/EntitySystem/gameObject";
import { Vector2D } from "@/engine/core/EntitySystem/geometry/Vector2D";
import { Transform } from "@/engine/core/EntitySystem/transform";

export interface BulletConfig {
    speed: number;
    size: number;
    damage: number;
}

export const BULLET_TYPES: Record<string, BulletConfig> = {
    light:     { speed: 400, size: 3,  damage: 25 },
    medium:    { speed: 300, size: 6,  damage: 50 },
    heavy:     { speed: 200, size: 10, damage: 100 },
    explosive: { speed: 250, size: 8,  damage: 75 },
};

export class Bullet extends Entity {
    public isAlive: boolean = true;
    public damage: number;
    public config: BulletConfig;

    private angle: number;
    private speed: number;
    private mapBounds: { cols: number; rows: number; tileSize: number };

    constructor(
        position: Vector2D,
        angle: number,
        config: BulletConfig,
        mapBounds: { cols: number; rows: number; tileSize: number }
    ) {
        const gameObject = new GameObject(
            'bullet',
            new Transform(position.Copy(), angle, new Vector2D(config.size, config.size)),
            { velocity: Vector2D.Zero, acceleration: Vector2D.Zero, angularVelocity: 0, mass: 0.1 },
            'dynamic'
        );

        super('bullet', 'dynamic', 1, gameObject);

        this.angle = angle;
        this.config = config;
        this.speed = config.speed;
        this.damage = config.damage;
        this.mapBounds = mapBounds;
    }

    public update(deltaTime: number) {
        if (!this.isAlive) return;

        const rad = (this.angle - 90) * (Math.PI / 180);
        const dir = new Vector2D(Math.cos(rad), Math.sin(rad));
        const moveAmount = this.speed * (deltaTime / 1000);

        const newX = this.gameObject.transform.position.x + dir.x * moveAmount;
        const newY = this.gameObject.transform.position.y + dir.y * moveAmount;

        this.gameObject.transform.updatePosition({ x: newX, y: newY });

        const s = this.config.size;
        if (newX < -s || newX > this.mapBounds.cols * this.mapBounds.tileSize + s ||
            newY < -s || newY > this.mapBounds.rows * this.mapBounds.tileSize + s) {
            this.isAlive = false;
        }
    }

    public destroy() {
        this.isAlive = false;
    }

    public get position(): Vector2D {
        return this.gameObject.transform.position;
    }

    public get tileX(): number {
        return Math.floor(this.gameObject.transform.position.x / this.mapBounds.tileSize);
    }

    public get tileY(): number {
        return Math.floor(this.gameObject.transform.position.y / this.mapBounds.tileSize);
    }
}
