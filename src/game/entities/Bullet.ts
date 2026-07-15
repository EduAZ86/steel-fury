import { Entity } from "@/engine/core/EntitySystem/Entity";
import { GameObject } from "@/engine/core/EntitySystem/gameObject";
import { Vector2D } from "@/engine/core/EntitySystem/geometry/Vector2D";
import { Transform } from "@/engine/core/EntitySystem/transform";
import { Direction, DIRECTION_VECTOR } from "./Tank";

export interface BulletConfig {
    speed: number;
    size: number;
    damage: number;
}

export class Bullet extends Entity {
    public direction: Direction;
    public isAlive: boolean = true;
    public damage: number;

    private speed: number;
    private mapBounds: { cols: number; rows: number; tileSize: number };

    constructor(
        position: Vector2D,
        direction: Direction,
        config: BulletConfig,
        mapBounds: { cols: number; rows: number; tileSize: number }
    ) {
        const gameObject = new GameObject(
            'bullet',
            new Transform(position.Copy(), 0, new Vector2D(config.size, config.size)),
            { velocity: new Vector2D(0, 0), acceleration: new Vector2D(0, 0), angularVelocity: 0, mass: 0.1 },
            'dynamic'
        );

        super('bullet', 'dynamic', 1, gameObject.rigidBody.magnitudes, gameObject);

        this.direction = direction;
        this.speed = config.speed;
        this.damage = config.damage;
        this.mapBounds = mapBounds;
    }

    public update(deltaTime: number) {
        if (!this.isAlive) return;

        const dir = DIRECTION_VECTOR[this.direction];
        const moveAmount = this.speed * (deltaTime / 1000);

        const newX = this.gameObject.transform.position.x + dir.x * moveAmount;
        const newY = this.gameObject.transform.position.y + dir.y * moveAmount;

        this.gameObject.transform.updatePosition({ x: newX, y: newY });

        const pos = this.gameObject.transform.position;
        const halfSize = this.speed * 0.01;
        if (pos.x < -halfSize || pos.x > this.mapBounds.cols * this.mapBounds.tileSize + halfSize ||
            pos.y < -halfSize || pos.y > this.mapBounds.rows * this.mapBounds.tileSize + halfSize) {
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
