import { Vector2D } from "../EntitySystem/geometry/Vector2D"
import { ArrowSpaceEnterEscKeys } from "./ArrowSpaceEnterKeys"
import { MouseInput } from "./Mouse"

export class Inputs {
    keyboardInput: ArrowSpaceEnterEscKeys;
    mouseInput: MouseInput;
    constructor() {
        this.mouseInput = new MouseInput
        this.keyboardInput = new ArrowSpaceEnterEscKeys
    }

}