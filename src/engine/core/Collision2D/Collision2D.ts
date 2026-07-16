import { SquareShape } from "../EntitySystem/geometry/ColissionSquareShape";
import { collisionFace } from "./types";

export class Collision2D {
    private localShape: SquareShape;
    private colliderShape: SquareShape;
    constructor(localShape: SquareShape, colliderShape: SquareShape) {
        this.localShape = localShape;
        this.colliderShape = colliderShape;
    }
    public onCollision() {
        const collisions: collisionFace[] = []
        const local = this.localShape;
        const other = this.colliderShape;

        const overlapX = local.position.x < other.position.x + other.size.x &&
                         local.position.x + local.size.x > other.position.x;
        const overlapY = local.position.y < other.position.y + other.size.y &&
                         local.position.y + local.size.y > other.position.y;

        if (!overlapX || !overlapY) return collisions;

        const localCenterX = local.position.x + local.size.x / 2;
        const localCenterY = local.position.y + local.size.y / 2;
        const otherCenterX = other.position.x + other.size.x / 2;
        const otherCenterY = other.position.y + other.size.y / 2;

        const dx = localCenterX - otherCenterX;
        const dy = localCenterY - otherCenterY;

        if (Math.abs(dx) > Math.abs(dy)) {
            collisions.push(dx > 0 ? 'right' : 'left');
        } else {
            collisions.push(dy > 0 ? 'bottom' : 'top');
        }

        return collisions
    }

}