import { Vector2D } from "./geometry/Vector2D";

export class Transform {
    public position: Vector2D;
    public rotation: number;
    public scale: Vector2D;

    constructor(position: Vector2D, rotation: number, scale: Vector2D) {
        this.position = position !== undefined ? position : new Vector2D(0, 0);
        this.rotation = rotation !== undefined ? rotation : 0;
        this.scale = scale !== undefined ? scale : new Vector2D(0, 0);
    }
}
