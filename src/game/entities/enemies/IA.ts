import { Vector2D } from "@/engine/core/EntitySystem/geometry/Vector2D";
import { AIState } from "./types";
import { Enemy } from "./Enemy";

export class EnemyIA {
    private enemy: Enemy;

    private aiState: AIState = "patrol";
    private patrolTarget: Vector2D | null = null;

    constructor(enemy: Enemy) {
        this.enemy = enemy;
    }

    public update(
        dt: number,
        playerPosition: Vector2D
    ) {
        const distToPlayer =
            this.enemy.position.Subtract(playerPosition).magnitude;

        const angleToPlayer =
            this.enemy.getAngleToTarget(playerPosition);

        const angleDiff =
            this.enemy.getAngleDifference(
                this.enemy.rotation,
                angleToPlayer
            );

        this.updateState(
            distToPlayer,
            angleDiff
        );

        switch (this.aiState) {
            case "patrol":
                this.doPatrol(dt);
                break;

            case "chase":
                this.doChase(dt, angleToPlayer);
                break;

            case "attack":
                this.doAttack(dt, angleToPlayer);
                break;

            case "retreat":
                this.doRetreat(dt, angleToPlayer);
                break;
        }
    }

    private updateState(
        distToPlayer: number,
        angleDiff: number
    ) {
        const isFacingPlayer = Math.abs(angleDiff) < 30;

        if (distToPlayer < 100) {
            this.aiState = "retreat";
        }
        else if (
            distToPlayer < this.enemy.config.aggroRange &&
            isFacingPlayer
        ) {
            this.aiState = "attack";
        }
        else if (
            distToPlayer < this.enemy.config.aggroRange
        ) {
            this.aiState = "chase";
        }
        else {
            this.aiState = "patrol";
        }
    }

    private doPatrol(dt: number) {
        if (
            !this.patrolTarget ||
            this.enemy.isAtPatrolTarget(this.patrolTarget)
        ) {
            this.patrolTarget =
                this.enemy.pickNewPatrolTarget();
        }

        if (!this.patrolTarget) return;

        const angle =
            this.enemy.getAngleToTarget(this.patrolTarget);

        this.enemy.rotateTowards(angle, dt);
        this.enemy.moveForward(dt);
    }

    private doChase(
        dt: number,
        angleToPlayer: number
    ) {
        this.enemy.rotateTowards(angleToPlayer, dt);
        this.enemy.moveForward(dt);
    }

    private doAttack(
        dt: number,
        angleToPlayer: number
    ) {
        this.enemy.rotateTowards(angleToPlayer, dt);

        const diff =
            this.enemy.getAngleDifference(
                this.enemy.rotation,
                angleToPlayer
            );

        if (Math.abs(diff) < 15) {
            this.enemy.moveForward(dt);
        } else {
            this.enemy.applyFriction(dt);
        }
    }

    private doRetreat(
        dt: number,
        angleToPlayer: number
    ) {
        const retreat =
            (angleToPlayer + 180) % 360;

        this.enemy.rotateTowards(retreat, dt);
        this.enemy.moveForward(dt);
    }
}