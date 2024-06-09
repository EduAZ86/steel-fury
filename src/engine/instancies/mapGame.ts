import { Entity } from "../core/EntitySystem/Entity";
import { GameObject } from "../core/EntitySystem/gameObject";
import { magnitudes } from "../core/EntitySystem/types";

export class MapGame extends Entity {
    mapObjects: GameObject[];
    constructor(name: string, healt: number, magnitudes: magnitudes, gameObject: GameObject) {
        super(name, 'static', healt, magnitudes, gameObject)
        this.mapObjects = []
    }

    addObjects(newObject: GameObject | GameObject[]) {
        if (Array.isArray(newObject)) {
            this.mapObjects = this.mapObjects.concat(newObject);
        } else {
            this.mapObjects.push(newObject);
        }
    }
}