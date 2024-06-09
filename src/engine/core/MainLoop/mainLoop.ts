
import { drawIteration, updateIteration } from "./Iteration";
import { DeltaTime } from "./deltaTime";

export class MainLoop {
    private executionId: number | null = null
    private lastRecord: number = 0;
    private aps: number = 0;
    private fps: number = 0;
    private updateIteration: updateIteration;
    private drawIteration: drawIteration;
    private deltaTime: DeltaTime;

    constructor(
        updateIteration: updateIteration,
        drwwIteration: drawIteration
    ) {
        this.updateIteration = updateIteration;
        this.drawIteration = drwwIteration;
        this.deltaTime = new DeltaTime();
    }
    public iteration = (timeRecord?: number) => {
        if (typeof window !== 'undefined') {
            this.executionId = window.requestAnimationFrame(this.iteration);
        }
        this.update(timeRecord!);
        this.draw(timeRecord!);

        //FPS and APS counter
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
        this.updateIteration.updatePysics();
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

    public stop = () => { };
}