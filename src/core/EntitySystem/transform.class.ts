import { Vector2D } from "./geometry/Vector2D.class";

export class Transform {
    public position: Vector2D;
    public rotation: number;
    public scale: number;

    constructor(position?: Vector2D, rotation?: number, scale?: number) {
        this.position = position !== undefined ? position : new Vector2D(0, 0);
        this.rotation = rotation !== undefined ? rotation : 0;
        this.scale = scale !== undefined ? scale : 1;
    }
}
