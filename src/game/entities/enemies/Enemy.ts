import { Entity } from "@/engine/core/EntitySystem/Entity";
import { GameObject } from "@/engine/core/EntitySystem/gameObject";
import { Vector2D } from "@/engine/core/EntitySystem/geometry/Vector2D";
import { Transform } from "@/engine/core/EntitySystem/transform";

import { EnemyClass, EnemyConfig } from "./types";
import { ENEMY_CONFIGS } from "./config";
import { EnemyIA } from "./IA";

export class Enemy extends Entity {
    public isAlive = true;
    public config: EnemyConfig;
    public enemyClass: EnemyClass;
    public velocity: Vector2D = Vector2D.Zero;

    private readonly maxSpeed: number;
    private readonly acceleration: number;
    private readonly deceleration: number;
    private readonly rotationSpeed: number;
    private readonly tankSize: number;

    private readonly mapBounds: {
        cols: number;
        rows: number;
        tileSize: number;
    };

    private shootTimer = 0;
    private canShoot = true;

    private ai: EnemyIA;

    constructor(
        position: Vector2D,
        enemyClass: EnemyClass,
        mapBounds: {
            cols: number;
            rows: number;
            tileSize: number;
        }
    ) {
        const config = ENEMY_CONFIGS[enemyClass];

        const gameObject = new GameObject(
            `enemy_${enemyClass}`,
            new Transform(
                position.Copy(),
                0,
                new Vector2D(config.size, config.size)
            ),
            {
                velocity: Vector2D.Zero,
                acceleration: Vector2D.Zero,
                angularVelocity: 0,
                mass: 1,
            },
            "dynamic"
        );

        super(
            `enemy_${enemyClass}`,
            "dynamic",
            config.health,
            gameObject
        );

        this.config = config;
        this.enemyClass = enemyClass;
        this.mapBounds = mapBounds;

        this.maxSpeed = config.maxSpeed;
        this.acceleration = config.acceleration;
        this.deceleration = config.deceleration;
        this.rotationSpeed = config.rotationSpeed;
        this.tankSize = config.size;

        this.ai = new EnemyIA(this);
    }

    public update(
        deltaTime: number,
        playerPosition: Vector2D,
        canMoveTo: (x: number, y: number) => boolean,
        speedModifier: number
    ) {
        if (!this.isAlive) return;

        const dt = deltaTime / 1000;

        this.shootTimer += deltaTime;

        this.ai.update(dt, playerPosition);

        this.applyVelocity(
            dt,
            speedModifier,
            canMoveTo
        );

        this.applyFriction(dt);

        if (this.shootTimer >= this.config.shootCooldown) {
            this.canShoot = true;
        }
    }

    // ==========================
    // Métodos usados por EnemyIA
    // ==========================

    public rotateTowards(targetAngle: number, dt: number) {
        const current = this.rotation;

        const diff = this.getAngleDifference(
            current,
            targetAngle
        );

        if (Math.abs(diff) < 2) return;

        const maxRotation = this.rotationSpeed * dt;

        const rotation =
            Math.sign(diff) *
            Math.min(Math.abs(diff), maxRotation);

        this.gameObject.transform.updateRotation(
            current + rotation
        );
    }

    public moveForward(dt: number) {
        const rad =
            (this.rotation - 90) *
            (Math.PI / 180);

        const direction = new Vector2D(
            Math.cos(rad),
            Math.sin(rad)
        );

        this.velocity = this.velocity.Sum(
            direction.Multiply(
                this.acceleration * dt
            )
        );

        if (this.velocity.magnitude > this.maxSpeed) {
            this.velocity =
                this.velocity.normalized.Multiply(
                    this.maxSpeed
                );
        }
    }

    public applyFriction(dt: number) {
        const friction =
            1 - this.deceleration * dt;

        this.velocity =
            this.velocity.Multiply(
                Math.max(0, friction)
            );

        if (this.velocity.magnitude < 0.5) {
            this.velocity = Vector2D.Zero;
        }
    }

    public getAngleToTarget(target: Vector2D): number {
        const dx = target.x - this.position.x;
        const dy = target.y - this.position.y;

        return (
            (Math.atan2(dy, dx) * 180) /
                Math.PI +
            90 +
            360
        ) % 360;
    }

    public getAngleDifference(
        from: number,
        to: number
    ): number {
        let diff = to - from;

        while (diff > 180) diff -= 360;
        while (diff < -180) diff += 360;

        return diff;
    }

    public pickNewPatrolTarget(): Vector2D {
        const ts = this.mapBounds.tileSize;

        const margin = ts * 2;

        const maxX =
            this.mapBounds.cols * ts - margin;

        const maxY =
            this.mapBounds.rows * ts - margin;

        return new Vector2D(
            margin +
                Math.random() *
                    (maxX - margin),
            margin +
                Math.random() *
                    (maxY - margin)
        );
    }

    public isAtPatrolTarget(
        target: Vector2D
    ): boolean {
        return (
            this.position
                .Subtract(target)
                .magnitude < 32
        );
    }

    // ==========================
    // Movimiento físico
    // ==========================

    private applyVelocity(
        dt: number,
        speedModifier: number,
        canMoveTo: (
            x: number,
            y: number
        ) => boolean
    ) {
        const effectiveVelocity =
            this.velocity.Multiply(speedModifier);

        const halfSize =
            this.tankSize / 2;

        const maxCol =
            this.mapBounds.cols *
            this.mapBounds.tileSize;

        const maxRow =
            this.mapBounds.rows *
            this.mapBounds.tileSize;

        let newX =
            this.position.x +
            effectiveVelocity.x * dt;

        let newY =
            this.position.y +
            effectiveVelocity.y * dt;

        newX = Math.max(
            halfSize,
            Math.min(maxCol - halfSize, newX)
        );

        newY = Math.max(
            halfSize,
            Math.min(maxRow - halfSize, newY)
        );

        const okX = canMoveTo(
            newX,
            this.position.y
        );

        const okY = canMoveTo(
            okX ? newX : this.position.x,
            newY
        );

        if (okX) {
            this.gameObject.transform.updatePosition({
                x: newX,
                y: this.position.y,
            });
        }

        if (okY) {
            this.gameObject.transform.updatePosition({
                x: this.position.x,
                y: newY,
            });
        }
    }

    // ==========================
    // Disparo
    // ==========================

    public tryShoot(): { x: number; y: number; angle: number } | null {
        if (!this.canShoot || !this.isAlive) return null;

        this.canShoot = false;
        this.shootTimer = 0;

        const rotation = this.gameObject.transform.rotation;
        const rad = (rotation - 90) * (Math.PI / 180);
        const dir = new Vector2D(Math.cos(rad), Math.sin(rad));

        const halfDiagonal = this.config.size / Math.sqrt(2);
        const bulletRadius = this.config.bulletConfig.size / 2;
        const offset = halfDiagonal + bulletRadius + 1;

        return {
            x: this.gameObject.transform.position.x + dir.x * offset,
            y: this.gameObject.transform.position.y + dir.y * offset,
            angle: rotation,
        };
    }

    public takeDamage(damage: number) {
        this.health -= damage;
        if (this.health <= 0) {
            this.isAlive = false;
        }
    }

    // ==========================
    // Getters
    // ==========================

    public get position(): Vector2D {
        return this.gameObject.transform.position;
    }

    public get rotation(): number {
        return this.gameObject.transform.rotation;
    }
}