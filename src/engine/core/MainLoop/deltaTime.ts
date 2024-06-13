export class DeltaTime {
    private _previusTime: number;
    private _deltaTime: number;
    constructor() {
        this._previusTime = performance.now();
        this._deltaTime = 0;
        this._updateDeltaTime()
    }
    private _updateDeltaTime() {
        const currentTime = performance.now();
        const delta = currentTime - this._previusTime;
        this._previusTime = currentTime;
        this._deltaTime = delta;
    }
    public get getDeltaTime() {
        return this._deltaTime;
    }
}