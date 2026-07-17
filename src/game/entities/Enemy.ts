import { Entity } from "@/engine/core/EntitySystem/Entity";
import { GameObject } from "@/engine/core/EntitySystem/gameObject";
import { Vector2D } from "@/engine/core/EntitySystem/geometry/Vector2D";
import { Transform } from "@/engine/core/EntitySystem/transform";
import { BulletConfig } from "./Bullet";

export interface EnemyConfig {
    maxSpeed: number;
    acceleration: number;
    deceleration: number;
    rotationSpeed: number;
    size: number;
    health: number;
    color: string;
    darkColor: string;
    bulletConfig: BulletConfig;
    shootCooldown: number;
    aggroRange: number;
}

export type EnemyClass = 'scout' | 'grunt' | 'heavy' | 'artillery' | 'commander';

export const ENEMY_CONFIGS: Record<EnemyClass, EnemyConfig> = {
    scout: {
        maxSpeed: 100,
        acceleration: 300,
        deceleration: 3,
        rotationSpeed: 200,
        size: 24,
        health: 30,
        color: '#f97316',
        darkColor: '#c2410c',
        bulletConfig: { speed: 350, size: 3, damage: 15 },
        shootCooldown: 1500,
        aggroRange: 400,
    },
    grunt: {
        maxSpeed: 70,
        acceleration: 250,
        deceleration: 3,
        rotationSpeed: 150,
        size: 28,
        health: 60,
        color: '#ef4444',
        darkColor: '#991b1b',
        bulletConfig: { speed: 280, size: 5, damage: 30 },
        shootCooldown: 2000,
        aggroRange: 350,
    },
    heavy: {
        maxSpeed: 40,
        acceleration: 200,
        deceleration: 2,
        rotationSpeed: 100,
        size: 36,
        health: 120,
        color: '#a855f7',
        darkColor: '#6b21a8',
        bulletConfig: { speed: 200, size: 8, damage: 60 },
        shootCooldown: 3000,
        aggroRange: 300,
    },
    artillery: {
        maxSpeed: 35,
        acceleration: 180,
        deceleration: 2,
        rotationSpeed: 80,
        size: 30,
        health: 50,
        color: '#eab308',
        darkColor: '#a16207',
        bulletConfig: { speed: 400, size: 6, damage: 45 },
        shootCooldown: 2500,
        aggroRange: 500,
    },
    commander: {
        maxSpeed: 55,
        acceleration: 220,
        deceleration: 2,
        rotationSpeed: 120,
        size: 40,
        health: 200,
        color: '#dc2626',
        darkColor: '#7f1d1d',
        bulletConfig: { speed: 250, size: 10, damage: 80 },
        shootCooldown: 3500,
        aggroRange: 350,
    },
};

type AIState = 'patrol' | 'chase' | 'attack' | 'retreat';

export class Enemy extends Entity {
    public isAlive: boolean = true;
    public config: EnemyConfig;
    public enemyClass: EnemyClass;
    public velocity: Vector2D = Vector2D.Zero;

    private maxSpeed: number;
    private acceleration: number;
    private deceleration: number;
    private rotationSpeed: number;
    private tankSize: number;
    private mapBounds: { cols: number; rows: number; tileSize: number };

    private aiState: AIState = 'patrol';
    private stateTimer: number = 0;
    private patrolTarget: Vector2D | null = null;
    private shootTimer: number = 0;
    private canShoot: boolean = true;

    constructor(
        position: Vector2D,
        enemyClass: EnemyClass,
        mapBounds: { cols: number; rows: number; tileSize: number }
    ) {
        const config = ENEMY_CONFIGS[enemyClass];
        const gameObject = new GameObject(
            `enemy_${enemyClass}`,
            new Transform(position.Copy(), 0, new Vector2D(config.size, config.size)),
            { velocity: Vector2D.Zero, acceleration: Vector2D.Zero, angularVelocity: 0, mass: 1 },
            'dynamic'
        );

        super(`enemy_${enemyClass}`, 'dynamic', config.health, gameObject);

        this.config = config;
        this.enemyClass = enemyClass;
        this.mapBounds = mapBounds;
        this.maxSpeed = config.maxSpeed;
        this.acceleration = config.acceleration;
        this.deceleration = config.deceleration;
        this.rotationSpeed = config.rotationSpeed;
        this.tankSize = config.size;
    }

    public update(deltaTime: number, playerPosition: Vector2D, canMoveTo: (x: number, y: number) => boolean, speedModifier: number) {
        if (!this.isAlive) return;

        const dt = deltaTime / 1000;
        this.shootTimer += deltaTime;
        this.stateTimer += deltaTime;

        const distToPlayer = this.position.Subtract(playerPosition).magnitude;
        const angleToPlayer = this.getAngleToTarget(playerPosition);

        this.updateAIState(distToPlayer, angleToPlayer);
        this.executeAIAction(dt, playerPosition, angleToPlayer, distToPlayer);

        this.applyVelocity(dt, speedModifier, canMoveTo);

        this.applyFriction(dt);

        if (this.shootTimer >= this.config.shootCooldown) {
            this.canShoot = true;
        }
    }

    private updateAIState(distToPlayer: number, angleToPlayer: number) {
        const angleDiff = this.getAngleDifference(this.gameObject.transform.rotation, angleToPlayer);
        const isFacingPlayer = Math.abs(angleDiff) < 30;

        if (distToPlayer < 100) {
            this.aiState = 'retreat';
        } else if (distToPlayer < this.config.aggroRange && isFacingPlayer) {
            this.aiState = 'attack';
        } else if (distToPlayer < this.config.aggroRange) {
            this.aiState = 'chase';
        } else {
            this.aiState = 'patrol';
        }
    }

    private executeAIAction(dt: number, playerPosition: Vector2D, angleToPlayer: number, distToPlayer: number) {
        switch (this.aiState) {
            case 'patrol':
                this.doPatrol(dt);
                break;
            case 'chase':
                this.doChase(dt, angleToPlayer);
                break;
            case 'attack':
                this.doAttack(dt, angleToPlayer);
                break;
            case 'retreat':
                this.doRetreat(dt, angleToPlayer);
                break;
        }
    }

    private doPatrol(dt: number) {
        if (!this.patrolTarget || this.isAtPatrolTarget()) {
            this.pickNewPatrolTarget();
        }

        if (this.patrolTarget) {
            const angleToTarget = this.getAngleToTarget(this.patrolTarget);
            this.rotateTowards(angleToTarget, dt);
            this.moveForward(dt);
        }
    }

    private doChase(dt: number, angleToPlayer: number) {
        this.rotateTowards(angleToPlayer, dt);
        this.moveForward(dt);
    }

    private doAttack(dt: number, angleToPlayer: number) {
        this.rotateTowards(angleToPlayer, dt);

        const angleDiff = this.getAngleDifference(this.gameObject.transform.rotation, angleToPlayer);
        if (Math.abs(angleDiff) < 15) {
            this.moveForward(dt);
        } else {
            this.applyFriction(dt);
        }
    }

    private doRetreat(dt: number, angleToPlayer: number) {
        const retreatAngle = (angleToPlayer + 180) % 360;
        this.rotateTowards(retreatAngle, dt);
        this.moveForward(dt);
    }

    private rotateTowards(targetAngle: number, dt: number) {
        const currentAngle = this.gameObject.transform.rotation;
        const diff = this.getAngleDifference(currentAngle, targetAngle);

        if (Math.abs(diff) < 2) return;

        const maxRotation = this.rotationSpeed * dt;
        const rotation = Math.sign(diff) * Math.min(Math.abs(diff), maxRotation);

        this.gameObject.transform.updateRotation(currentAngle + rotation);
    }

    private moveForward(dt: number) {
        const rad = (this.gameObject.transform.rotation - 90) * (Math.PI / 180);
        const dir = new Vector2D(Math.cos(rad), Math.sin(rad));
        this.velocity = this.velocity.Sum(dir.Multiply(this.acceleration * dt));
        if (this.velocity.magnitude > this.maxSpeed) {
            this.velocity = this.velocity.normalized.Multiply(this.maxSpeed);
        }
    }

    private applyFriction(dt: number) {
        const friction = 1 - this.deceleration * dt;
        this.velocity = this.velocity.Multiply(Math.max(0, friction));
        if (this.velocity.magnitude < 0.5) {
            this.velocity = Vector2D.Zero;
        }
    }

    private applyVelocity(dt: number, speedModifier: number, canMoveTo: (x: number, y: number) => boolean) {
        const effectiveVelocity = this.velocity.Multiply(speedModifier);
        const halfSize = this.tankSize / 2;
        const maxCol = this.mapBounds.cols * this.mapBounds.tileSize;
        const maxRow = this.mapBounds.rows * this.mapBounds.tileSize;

        let newX = this.gameObject.transform.position.x + effectiveVelocity.x * dt;
        let newY = this.gameObject.transform.position.y + effectiveVelocity.y * dt;

        newX = Math.max(halfSize, Math.min(maxCol - halfSize, newX));
        newY = Math.max(halfSize, Math.min(maxRow - halfSize, newY));

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
            const curY = this.gameObject.transform.position.y;
            if (canMoveTo(newX, curY)) {
                this.gameObject.transform.updatePosition({ x: newX, y: curY });
            }
            if (canMoveTo(this.gameObject.transform.position.x, newY)) {
                this.gameObject.transform.updatePosition({ x: this.gameObject.transform.position.x, y: newY });
            }
        }
    }

    private getAngleToTarget(target: Vector2D): number {
        const dx = target.x - this.position.x;
        const dy = target.y - this.position.y;
        return (Math.atan2(dy, dx) * (180 / Math.PI) + 90 + 360) % 360;
    }

    private getAngleDifference(from: number, to: number): number {
        let diff = to - from;
        while (diff > 180) diff -= 360;
        while (diff < -180) diff += 360;
        return diff;
    }

    private pickNewPatrolTarget() {
        const ts = this.mapBounds.tileSize;
        const margin = ts * 2;
        const maxX = this.mapBounds.cols * ts - margin;
        const maxY = this.mapBounds.rows * ts - margin;

        this.patrolTarget = new Vector2D(
            margin + Math.random() * (maxX - margin),
            margin + Math.random() * (maxY - margin)
        );
    }

    private isAtPatrolTarget(): boolean {
        if (!this.patrolTarget) return true;
        return this.position.Subtract(this.patrolTarget).magnitude < 32;
    }

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

    public get position(): Vector2D {
        return this.gameObject.transform.position;
    }

    public get rotation(): number {
        return this.gameObject.transform.rotation;
    }
}
