import { Vector2D } from "@/engine/core/EntitySystem/geometry/Vector2D";
import { AIState } from "./types";
import { Enemy } from "./Enemy";

export class EnemyIA {
    private enemy: Enemy;

    private aiState: AIState = "patrol";
    private patrolTarget: Vector2D | null = null;
    private targetBase: boolean = false;

    constructor(enemy: Enemy) {
        this.enemy = enemy;
    }

    public update(
        dt: number,
        playerPosition: Vector2D,
        basePosition: Vector2D
    ) {
        const distToPlayer =
            this.enemy.position.Subtract(playerPosition).magnitude;

        const distToBase =
            this.enemy.position.Subtract(basePosition).magnitude;

        const primaryTarget = distToBase < distToPlayer ? basePosition : playerPosition;
        this.targetBase = distToBase < distToPlayer;

        const angleToTarget =
            this.enemy.getAngleToTarget(primaryTarget);

        const angleDiff =
            this.enemy.getAngleDifference(
                this.enemy.rotation,
                angleToTarget
            );

        this.updateState(
            distToPlayer,
            distToBase,
            angleDiff
        );

        switch (this.aiState) {
            case "patrol":
                this.doPatrol(dt, basePosition);
                break;

            case "chase":
                this.doChase(dt, angleToTarget);
                break;

            case "attack":
                this.doAttack(dt, angleToTarget);
                break;

            case "retreat":
                this.doRetreat(dt, angleToTarget);
                break;
        }
    }

    private updateState(
        distToPlayer: number,
        distToBase: number,
        angleDiff: number
    ) {
        const isFacingTarget = Math.abs(angleDiff) < 30;
        const closestDist = Math.min(distToPlayer, distToBase);

        if (closestDist < 100) {
            this.aiState = "retreat";
        }
        else if (
            closestDist < this.enemy.config.aggroRange &&
            isFacingTarget
        ) {
            this.aiState = "attack";
        }
        else if (
            closestDist < this.enemy.config.aggroRange
        ) {
            this.aiState = "chase";
        }
        else {
            this.aiState = "patrol";
        }
    }

    private doPatrol(dt: number, basePosition: Vector2D) {
        if (
            !this.patrolTarget ||
            this.enemy.isAtPatrolTarget(this.patrolTarget)
        ) {
            this.patrolTarget = this.targetBase
                ? basePosition.Copy()
                : this.enemy.pickNewPatrolTarget();
        }

        if (!this.patrolTarget) return;

        const angle =
            this.enemy.getAngleToTarget(this.patrolTarget);

        this.enemy.rotateTowards(angle, dt);
        this.enemy.moveForward(dt);
    }

    private doChase(
        dt: number,
        angleToTarget: number
    ) {
        this.enemy.rotateTowards(angleToTarget, dt);
        this.enemy.moveForward(dt);
    }

    private doAttack(
        dt: number,
        angleToTarget: number
    ) {
        this.enemy.rotateTowards(angleToTarget, dt);

        const diff =
            this.enemy.getAngleDifference(
                this.enemy.rotation,
                angleToTarget
            );

        if (Math.abs(diff) < 15) {
            this.enemy.moveForward(dt);
        } else {
            this.enemy.applyFriction(dt);
        }
    }

    private doRetreat(
        dt: number,
        angleToTarget: number
    ) {
        const retreat =
            (angleToTarget + 180) % 360;

        this.enemy.rotateTowards(retreat, dt);
        this.enemy.moveForward(dt);
    }
}
