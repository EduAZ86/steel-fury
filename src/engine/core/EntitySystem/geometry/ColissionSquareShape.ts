import { verticesSquare } from "../../Collision2D/types";
import { Iposition, Isize } from "../types";

export class SquareShape {

    position: Iposition;
    size: Iposition;
    vertices: verticesSquare;

    constructor(position: Iposition, size: Isize) {
        this.position = position;
        this.size = size;
        this.vertices = {
            bR: {
                x: this.position.x,
                y: this.position.y
            },
            tR: {
                x: this.position.x,
                y: this.position.y + this.size.y
            },
            bL: {
                x: this.position.x + this.size.x,
                y: this.position.y
            },
            tL: {
                x: this.position.x + this.size.x,
                y: this.position.y + this.size.y
            }
        }
    }
}