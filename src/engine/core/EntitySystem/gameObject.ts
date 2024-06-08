import { UUID } from "crypto";
import { v4 as uuidv4 } from 'uuid';
import { Transform } from "./transform";
import { RigidBody2D } from "./rigidBody2D";
import { bodyType, magnitudes } from "./types";
export class GameObject {
    id: UUID;
    name: string;
    active: boolean;
    destroyed: boolean;
    transform: Transform;
    rigidBody: RigidBody2D;
    constructor(name: string, transform: Transform, magnitudes: magnitudes, bodyType: bodyType) {
        this.active = true;
        this.name = name;
        this.id = uuidv4() as UUID;
        this.transform = transform;
        this.destroyed = false;
        this.rigidBody = new RigidBody2D(
            bodyType,
            magnitudes,
            this.transform.position,
            this.transform.scale
        )
    }
    get activeSelf() { return this.active };

    get getTransform() { return this.transform };

    get getDestroyed() { return this.destroyed };


    set SetActive(active: boolean) {
        if (active === this.active)
            return;
        this.active = active;
    }

    public Destroy() {
        this.destroyed = true;
    }
}