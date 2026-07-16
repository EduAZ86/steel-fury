import { GameObject } from "./gameObject";
import { Iposition, Isize, bodyType } from "./types";
export class Entity {
    name: string;
    health: number;
    started: boolean;
    coroutines: any[];
    gameObject: GameObject;
    constructor(name: string, bodyType: bodyType, health: number, gameObject: GameObject) {
        this.started = false;
        this.coroutines = [];
        this.gameObject = gameObject;

        this.name = name;
        this.health = health;
    };

    get getTransform() { return this.gameObject.transform; }
    get rigidBody() { return this.gameObject.rigidBody; }
    get getStarted() { return this.started; }
    ;
    Awake() {
    };
    Start() {
    };
    Update(newPosition?: Iposition, newScale?: Isize, newRotation?: number) {
        if (newPosition !== undefined) this.gameObject.transform.updatePosition(newPosition);
        if (newScale !== undefined) this.gameObject.transform.updateScale(newScale);
        if (newRotation !== undefined) this.gameObject.transform.updateRotation(newRotation);
    };
    OnDestroy() {
        this.gameObject.Destroy();
    };
    OnCollisionEnter2D(otherColliders: GameObject[]) {
        this.gameObject.OnCollision2D(otherColliders)
    };

    CheckStart() {
        this.started = true;
    }
    public RunUpdateCoroutines() {
        if (this.coroutines.length == 0)
            return;
        this.coroutines.forEach(cor => {
            cor._OnUpdate();
            if (cor._ConditionFullfilled())
                cor._Next();
        });
        this.coroutines = this.coroutines.filter(c => !c.isFinished);
    }
}