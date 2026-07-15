export class DeltaTime {
    private _previousTime: number;
    private _deltaTime: number;
    private _started: boolean;

    constructor() {
        this._previousTime = 0;
        this._deltaTime = 0;
        this._started = false;
    }

    public update(currentTime: number) {
        if (!this._started) {
            this._previousTime = currentTime;
            this._started = true;
            this._deltaTime = 0;
            return;
        }
        this._deltaTime = currentTime - this._previousTime;
        this._previousTime = currentTime;
    }

    public get getDeltaTime() {
        return this._deltaTime;
    }

    public get getDeltaTimeSeconds() {
        return this._deltaTime / 1000;
    }
}
