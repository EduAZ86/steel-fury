import { Entity } from "@/engine/core/EntitySystem/Entity";
import { GameObject } from "@/engine/core/EntitySystem/gameObject";
import { Vector2D } from "@/engine/core/EntitySystem/geometry/Vector2D";
import { Transform } from "@/engine/core/EntitySystem/transform";

export interface TankConfig {
    maxSpeed: number;
    acceleration: number;
    deceleration: number;
    rotationSpeed: number;
    tileSize: number;
    tankSize: number;
    health: number;
}

export class Tank extends Entity {
    public velocity: Vector2D = Vector2D.Zero;
    public canShoot: boolean = true;
    public shootCooldown: number = 0;
    public shootCooldownMax: number = 200;

    private maxSpeed: number;
    private acceleration: number;
    private deceleration: number;
    private rotationSpeed: number;
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
            { velocity: Vector2D.Zero, acceleration: Vector2D.Zero, angularVelocity: 0, mass: 1 },
            'dynamic'
        );

        super(name, 'dynamic', config.health, gameObject);

        this.maxSpeed = config.maxSpeed;
        this.acceleration = config.acceleration;
        this.deceleration = config.deceleration;
        this.rotationSpeed = config.rotationSpeed;
        this.tileSize = config.tileSize;
        this.tankSize = config.tankSize;
        this.mapBounds = mapBounds;
    }

    public rotate(angleDelta: number) {
        const current = this.gameObject.transform.rotation;
        this.gameObject.transform.updateRotation(current + angleDelta);
    }

    public moveForward(dt: number) {
        const rad = (this.gameObject.transform.rotation - 90) * (Math.PI / 180);
        const dir = new Vector2D(Math.cos(rad), Math.sin(rad));
        this.velocity = this.velocity.Sum(dir.Multiply(this.acceleration * dt));
        if (this.velocity.magnitude > this.maxSpeed) {
            this.velocity = this.velocity.normalized.Multiply(this.maxSpeed);
        }
    }

    public moveBackward(dt: number) {
        const rad = (this.gameObject.transform.rotation - 90) * (Math.PI / 180);
        const dir = new Vector2D(Math.cos(rad), Math.sin(rad));
        this.velocity = this.velocity.Substract(dir.Multiply(this.acceleration * dt));
        if (this.velocity.magnitude > this.maxSpeed * 0.5) {
            this.velocity = this.velocity.normalized.Multiply(this.maxSpeed * 0.5);
        }
    }

    public applyFriction(dt: number) {
        const friction = 1 - this.deceleration * dt;
        this.velocity = this.velocity.Multiply(Math.max(0, friction));
        if (this.velocity.magnitude < 0.5) {
            this.velocity = Vector2D.Zero;
        }
    }

    public applyVelocity(dt: number, speedModifier: number, canMoveTo?: (x: number, y: number) => boolean) {
        const effectiveVelocity = this.velocity.Multiply(speedModifier);
        const halfSize = this.tankSize / 2;
        const maxCol = this.mapBounds.cols * this.tileSize;
        const maxRow = this.mapBounds.rows * this.tileSize;

        let newX = this.gameObject.transform.position.x + effectiveVelocity.x * dt;
        let newY = this.gameObject.transform.position.y + effectiveVelocity.y * dt;

        newX = Math.max(halfSize, Math.min(maxCol - halfSize, newX));
        newY = Math.max(halfSize, Math.min(maxRow - halfSize, newY));

        if (canMoveTo) {
            const okX = canMoveTo(newX, this.gameObject.transform.position.y);
            const okY = canMoveTo(okX ? newX : this.gameObject.transform.position.x, newY);

            if (okX) {
                this.gameObject.transform.updatePosition({ x: newX, y: this.gameObject.transform.position.y });
            }
            if (okY) {
                const cur = this.gameObject.transform.position;
                this.gameObject.transform.updatePosition({ x: cur.x, y: newY });
            }
            if (!okX && !okY) {
                // Try each axis independently for wall sliding
                const curX = this.gameObject.transform.position.x;
                const curY = this.gameObject.transform.position.y;
                if (canMoveTo(newX, curY)) {
                    this.gameObject.transform.updatePosition({ x: newX, y: curY });
                }
                if (canMoveTo(this.gameObject.transform.position.x, newY)) {
                    this.gameObject.transform.updatePosition({ x: this.gameObject.transform.position.x, y: newY });
                }
            }
        } else {
            this.gameObject.transform.updatePosition({ x: newX, y: newY });
        }
    }

   public tryShoot(bulletSize: number = 6): { x: number; y: number; angle: number } | null {
    if (!this.canShoot) return null;

    this.canShoot = false;
    this.shootCooldown = this.shootCooldownMax;

    const rotation = this.gameObject.transform.rotation;
    const rad = (rotation - 90) * (Math.PI / 180);

    const dir = new Vector2D(Math.cos(rad), Math.sin(rad));

    const halfDiagonal = this.tankSize / Math.sqrt(2);
    const bulletRadius = bulletSize / 2;
    const safetyMargin = 1;

    const offset = halfDiagonal + bulletRadius + safetyMargin;

    return {
        x: this.gameObject.transform.position.x + dir.x * offset,
        y: this.gameObject.transform.position.y + dir.y * offset,
        angle: rotation,
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
