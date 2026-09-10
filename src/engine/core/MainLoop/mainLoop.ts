
import { drawIteration, updateIteration } from "./Iteration";
import { DeltaTime } from "./deltaTime";

export class MainLoop {
    private executionId: number | null = null
    private lastRecord: number = 0;
    private aps: number = 0;
    private fps: number = 0;
    private _running: boolean = false;
    private updateIteration: updateIteration;
    private drawIteration: drawIteration;
    private deltaTime: DeltaTime;

    constructor(
        updateIteration: updateIteration,
        drawIteration: drawIteration
    ) {
        this.updateIteration = updateIteration;
        this.drawIteration = drawIteration;
        this.deltaTime = new DeltaTime();
    }

    public iteration = (timeRecord?: number) => {
        if (!this._running) return;

        if (typeof window !== 'undefined') {
            this.executionId = window.requestAnimationFrame(this.iteration);
        }

        this.deltaTime.update(timeRecord!);

        this.update(timeRecord!);
        this.draw(timeRecord!);

        if (timeRecord && (timeRecord - this.lastRecord > 999)) {
            this.lastRecord = timeRecord;
            console.log(`APS: ${this.aps} | FPS: ${this.fps}`);
            this.aps = 0;
            this.fps = 0;
        }
    }

    public update = (timeRecord: number) => {
        this.aps++;
        this.updateIteration.movementOfEntities();
        this.updateIteration.collisionHandler();
        this.updateIteration.updateState();
        this.updateIteration.updatePhysics();
        this.updateIteration.inputsHandler();
        this.updateIteration.updateIA();
        this.updateIteration.syncMultiplayerState && this.updateIteration.syncMultiplayerState()
    };

    public draw = (timeRecord: number) => {
        this.fps++;
        this.drawIteration.drawMap();
        this.drawIteration.drawEntities();
        this.drawIteration.drawEntitiesState();
        this.drawIteration.drawEffects();
    };

    public start() {
        if (!this._running) {
            this._running = true;
            this.lastRecord = performance.now();
            this.iteration(performance.now());
        }
    }

    public stop = () => {
        this._running = false;
        if (this.executionId !== null && typeof window !== 'undefined') {
            window.cancelAnimationFrame(this.executionId);
            this.executionId = null;
        }
    };

    public get getDeltaTime() {
        return this.deltaTime.getDeltaTime;
    }

    public get getDeltaTimeSeconds() {
        return this.deltaTime.getDeltaTimeSeconds;
    }
}
