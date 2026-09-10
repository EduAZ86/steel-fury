import { Inputs, keys } from "@/engine";
import { Vector2D } from "@/engine/core/EntitySystem/geometry/Vector2D";
import { Tank, TankConfig } from "../entities/Tank";
import { Bullet, BulletConfig, BULLET_TYPES } from "../entities/Bullet";

export class PlayerController {
    public currentBulletType: string = "medium";

    private input: Inputs;
    private tank: Tank;
    private config: TankConfig;
    private mapBounds: { cols: number; rows: number; tileSize: number };

    constructor(
        tank: Tank,
        config: TankConfig,
        mapBounds: { cols: number; rows: number; tileSize: number }
    ) {
        this.tank = tank;
        this.config = config;
        this.mapBounds = mapBounds;
        this.input = new Inputs(["Keyboard"]);
        this.input.startTracking();
    }

    public update(
        deltaTime: number,
        speedModifier: number,
        canMoveTo: (x: number, y: number) => boolean
    ): Bullet | null {
        const dt = deltaTime / 1000;
        const inputData = this.input.getDataInputs;
        const keyState = inputData?.[0] as keys | undefined;
        if (!keyState) return null;

        let moved = false;

        if (keyState.arrowLeft) {
            this.tank.rotate(-this.config.rotationSpeed * dt);
        }
        if (keyState.arrowRight) {
            this.tank.rotate(this.config.rotationSpeed * dt);
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

        this.tank.applyVelocity(dt, speedModifier, canMoveTo);
        this.tank.updateShootCooldown(deltaTime);

        if (keyState.key1) this.currentBulletType = "light";
        if (keyState.key2) this.currentBulletType = "medium";
        if (keyState.key3) this.currentBulletType = "heavy";
        if (keyState.key4) this.currentBulletType = "explosive";

        if (keyState.space || keyState.enter) {
            return this.shoot();
        }

        return null;
    }

    private shoot(): Bullet | null {
        const bulletConfig =
            BULLET_TYPES[this.currentBulletType] ??
            BULLET_TYPES["medium"];
        const bulletInfo = this.tank.tryShoot(bulletConfig.size);
        if (!bulletInfo) return null;

        return new Bullet(
            new Vector2D(bulletInfo.x, bulletInfo.y),
            bulletInfo.angle,
            bulletConfig,
            this.mapBounds
        );
    }

    public get keyState(): keys | undefined {
        const inputData = this.input.getDataInputs;
        return inputData?.[0] as keys | undefined;
    }

    public destroy() {
        this.input.stopTracking();
    }
}
