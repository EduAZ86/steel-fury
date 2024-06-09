import { GameObject } from "./gameObject";
import { RigidBody2D } from "./rigidBody2D";
import { Iposition, Isize, bodyType, magnitudes } from "./types";
export class Entity {
    name: string;
    healt: number;
    started: boolean;
    coroutines: any[];
    gameObject: GameObject;
    rigidBody: RigidBody2D;
    constructor(name: string, bodyType: bodyType, healt: number, magnitudes: magnitudes, gameObject: GameObject) {
        this.started = false;
        this.coroutines = [];
        this.gameObject = gameObject;

        this.name = name;
        this.healt = healt;
        this.rigidBody = new RigidBody2D(
            bodyType,
            magnitudes,
            gameObject.transform.position,
            gameObject.transform.scale
        );
    };

    get getTransform() { return this.gameObject.transform; }
    ;
    get getStarted() { return this.started; }
    ;
    Awake() {
    };
    Start() {
    };
    Update(newPosition?: Iposition, newScale?: Isize, newRotation?: number) {
        newPosition && this.gameObject.transform.updatePosition(newPosition);
        newScale && this.gameObject.transform.updateScale(newScale);
        newRotation && this.gameObject.transform.updateRotation(newRotation);
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