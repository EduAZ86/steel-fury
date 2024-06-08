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
        //left
        if (this.localShape.vertices.bL.x >= this.colliderShape.vertices.bR.x &&
            this.colliderShape.vertices.tR.y > this.localShape.vertices.bL.y ||
            this.localShape.vertices.bL.y > this.colliderShape.vertices.tR.y) {
            collisions.push('left');
        }
        //right
        if (this.localShape.vertices.bR.x <= this.colliderShape.vertices.bL.x &&
            this.colliderShape.vertices.tL.y > this.localShape.vertices.bR.y ||
            this.localShape.vertices.bR.y > this.colliderShape.vertices.tL.y) {
            collisions.push('right');
        }
        //top
        if (this.localShape.vertices.tR.y >= this.colliderShape.vertices.bR.y &&
            this.colliderShape.vertices.bR.x > this.localShape.position.x ||
            this.localShape.vertices.tL.x > this.colliderShape.vertices.bR.x) {
            collisions.push('top')
        }
        //bottom
        if (this.localShape.vertices.bL.y >= this.colliderShape.vertices.tL.y &&
            this.colliderShape.vertices.tR.x > this.localShape.vertices.bL.x ||
            this.localShape.vertices.bL.x > this.colliderShape.vertices.tR.x) {
            collisions.push('bottom')
        }
        return collisions
    }

}