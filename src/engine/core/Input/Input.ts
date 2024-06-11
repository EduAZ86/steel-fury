import { Vector2D } from "../EntitySystem/geometry/Vector2D"
import { ArrowSpaceEnterEscKeys } from "./ArrowSpaceEnterKeys"
import { MouseInput } from "./Mouse"
import { InputsDevice } from "./types";

export class Inputs {
    keyboardInput: ArrowSpaceEnterEscKeys;
    mouseInput: MouseInput;
    inputsDevice: InputsDevice[]
    private _isTracking: boolean;
    constructor(inputsDevice: InputsDevice[]) {
        this.mouseInput = new MouseInput;
        this.keyboardInput = new ArrowSpaceEnterEscKeys;
        this.inputsDevice = inputsDevice;
        this._isTracking = false;
    };

    public get getDataInputs() {
        if (this._isTracking) {
            return {
                mouse: {
                    Left: this.mouseInput.leftClick,
                    Right: this.mouseInput.rightClick,
                    scroll: this.mouseInput.scrollDelta,
                    position: this.mouseInput.mousePosition
                },
                keyboard: this.keyboardInput.keysStatus
            }
        }
        return
    }

    public startTracking() {
        if (!this._isTracking) {
            if (this.inputsDevice.includes('Keyboard')) {
                this.keyboardInput.startTracking()
                this._isTracking = true;
            }
            if (this.inputsDevice.includes('Mouse')) {
                this.mouseInput.startTracking()
                this._isTracking = true;
            }
            return
        }
    }
    public stopTracking() {
        if (this._isTracking) {
            this.keyboardInput.stopTracking()
            this.mouseInput.stopTracking()
            this._isTracking = false;
        }
    }
}