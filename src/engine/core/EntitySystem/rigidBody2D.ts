type bodyType = 'dynamic' | 'kinetic' | 'static';

interface magnitudes {
    velocity: number;
    angularVelocity: number;
    acceleration: number;
    mass: number;
}

interface position {
    x: number
    y: number
}

interface size extends position { }

interface collisionShape {
    origin: position;
    end: { x: number, y: number }
}

export class RigidBody2D {
    bodyType: bodyType;
    magnitudes: magnitudes
    collisionShape: collisionShape;
    constructor(bodyType: bodyType, magnitudes: magnitudes, position: position, size: size) {
        this.collisionShape = {
            origin: position,
            end: {
                x: position.x + size.x,
                y: position.y + size.y
            }
        }
        this.bodyType = bodyType;
        this.magnitudes = magnitudes

    }
}