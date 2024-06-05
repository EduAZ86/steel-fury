import { Vector2D } from "./geometry/Vector2D";

export type bodyType = 'dynamic' | 'kinetic' | 'static';


interface acceleration extends position { }
export interface size extends position { }

export interface magnitudes {
    velocity: Vector2D;
    acceleration: Vector2D;
    angularVelocity: number;
    mass: number;
}

export interface position {
    x: number;
    y: number;
}

export interface collisionShape {
    origin: position;
    end: position;
}
