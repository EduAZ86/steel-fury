import { Vector2D } from "./geometry/Vector2D";

export type bodyType = 'dynamic' | 'kinetic' | 'static';


interface acceleration extends Iposition { }
export interface Isize extends Iposition { }

export interface magnitudes {
    velocity: Vector2D;
    acceleration: Vector2D;
    angularVelocity: number;
    mass: number;
}

export interface Iposition {
    x: number;
    y: number;
}

export interface CollisionData {
    relativeVelocities: { x: number, y: number };
    localColliderType: bodyType;
    otherColliderType: bodyType;
    directionCollision: collisionFace[];
}