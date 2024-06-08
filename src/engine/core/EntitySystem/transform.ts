import { Vector2D } from "./geometry/Vector2D";
import { Iposition, Isize } from "./types";

export class Transform {
    public position: Vector2D;
    public rotation: number;
    public scale: Vector2D;

    constructor(position: Vector2D, rotation: number, scale: Vector2D) {
        this.position = position !== undefined ? position : new Vector2D(0, 0);
        this.rotation = rotation !== undefined ? rotation : 0;
        this.scale = scale !== undefined ? scale : new Vector2D(0, 0);
    }
    updatePosition(newPosition: Iposition) {
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
    }

    updateScale(newScale: Isize) {
        this.scale.x = newScale.x;
        this.scale.y = newScale.y;
    }

    updateRotation(newRotation: number) {
        this.rotation = newRotation;
    }
}
