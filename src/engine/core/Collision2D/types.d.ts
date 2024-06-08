import { Iposition } from "../EntitySystem/types";

export type collisionFace = 'left' | 'top' | 'right' | 'bottom';


export interface verticesSquare {
    bR: Iposition;
    tR: Iposition;
    bL: Iposition;
    tL: Iposition;
}