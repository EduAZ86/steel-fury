export class DeltaTime {
    private previusTime: number;
    constructor() {
        this.previusTime = performance.now();
    }
    public getDeltaTime() {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.previusTime;
        this.previusTime = currentTime;
        return deltaTime
    }
}