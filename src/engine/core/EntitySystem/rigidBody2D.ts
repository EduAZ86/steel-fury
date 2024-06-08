import { SquareShape } from "./geometry/ColissionSquareShape";
import { bodyType, magnitudes, Iposition, Isize } from "./types";

export class RigidBody2D {
    bodyType: bodyType;
    magnitudes: magnitudes
    collisionShape: SquareShape;
    constructor(bodyType: bodyType, magnitudes: magnitudes, position: Iposition, size: Isize) {
        this.collisionShape = new SquareShape(position, size)
        this.bodyType = bodyType;
        this.magnitudes = magnitudes

    }
}