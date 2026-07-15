import { Entity } from "@/engine/core/EntitySystem/Entity";
import { GameObject } from "@/engine/core/EntitySystem/gameObject";
import { Vector2D } from "@/engine/core/EntitySystem/geometry/Vector2D";
import { Transform } from "@/engine/core/EntitySystem/transform";

export type Direction = 'up' | 'down' | 'left' | 'right';

const DIRECTION_ROTATION: Record<Direction, number> = {
    up: 0,
    right: 90,
    down: 180,
    left: 270,
};

const DIRECTION_VECTOR: Record<Direction, Vector2D> = {
    up: new Vector2D(0, -1),
    down: new Vector2D(0, 1),
    left: new Vector2D(-1, 0),
    right: new Vector2D(1, 0),
};

export { DIRECTION_VECTOR };

export interface TankConfig {
    speed: number;
    tileSize: number;
    tankSize: number;
}

export class Tank extends Entity {
    public direction: Direction = 'up';
    public isMoving: boolean = false;
    public canShoot: boolean = true;
    public shootCooldown: number = 0;
    public shootCooldownMax: number = 200;

    private speed: number;
    private tileSize: number;
    private tankSize: number;
    private mapBounds: { cols: number; rows: number };

    constructor(
        name: string,
        position: Vector2D,
        config: TankConfig,
        mapBounds: { cols: number; rows: number }
    ) {
        const gameObject = new GameObject(
            name,
            new Transform(position, 0, new Vector2D(config.tankSize, config.tankSize)),
            { velocity: new Vector2D(0, 0), acceleration: new Vector2D(0, 0), angularVelocity: 0, mass: 1 },
            'dynamic'
        );

        super(name, 'dynamic', 100, gameObject.rigidBody.magnitudes, gameObject);

        this.speed = config.speed;
        this.tileSize = config.tileSize;
        this.tankSize = config.tankSize;
        this.mapBounds = mapBounds;
    }

    public move(direction: Direction, deltaTime: number, canMoveTo?: (x: number, y: number) => boolean) {
        this.direction = direction;
        this.isMoving = true;

        const targetRotation = DIRECTION_ROTATION[direction];
        this.gameObject.transform.updateRotation(targetRotation);

        const dir = DIRECTION_VECTOR[direction];
        const moveAmount = this.speed * (deltaTime / 1000);

        const newX = this.gameObject.transform.position.x + dir.x * moveAmount;
        const newY = this.gameObject.transform.position.y + dir.y * moveAmount;

        const halfSize = this.tankSize / 2;
        const clampedX = Math.max(halfSize, Math.min(this.mapBounds.cols * this.tileSize - halfSize, newX));
        const clampedY = Math.max(halfSize, Math.min(this.mapBounds.rows * this.tileSize - halfSize, newY));

        if (canMoveTo && !canMoveTo(clampedX, clampedY)) return;

        this.gameObject.transform.updatePosition({ x: clampedX, y: clampedY });
    }

    public stopMoving() {
        this.isMoving = false;
    }

    public tryShoot(): { x: number; y: number; direction: Direction } | null {
        if (!this.canShoot) return null;

        this.canShoot = false;
        this.shootCooldown = this.shootCooldownMax;

        const pos = this.gameObject.transform.position;
        const dir = DIRECTION_VECTOR[this.direction];
        const offset = this.tankSize / 2 + 2;

        return {
            x: pos.x + dir.x * offset,
            y: pos.y + dir.y * offset,
            direction: this.direction,
        };
    }

    public updateShootCooldown(deltaTime: number) {
        if (!this.canShoot) {
            this.shootCooldown -= deltaTime;
            if (this.shootCooldown <= 0) {
                this.canShoot = true;
                this.shootCooldown = 0;
            }
        }
    }

    public get position(): Vector2D {
        return this.gameObject.transform.position;
    }

    public get rotation(): number {
        return this.gameObject.transform.rotation;
    }
}
