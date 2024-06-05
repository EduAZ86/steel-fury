import { UUID } from "crypto";
import { GameObject } from "./gameObject";
import { v4 as uuidv4 } from 'uuid';
import { RigidBody2D } from "./rigidBody2D";
import { bodyType, magnitudes } from "./types";


export class Entity {
    id: UUID;
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
        this.id = uuidv4() as UUID;
        this.name = name;
        this.healt = healt;
        this.rigidBody = new RigidBody2D(
            bodyType,
            magnitudes,
            gameObject.transform.position,
            gameObject.transform.scale
        )

    }

    get getTransform() { return this.gameObject.transform; }
    ;
    get getStarted() { return this.started; }
    ;
    Awake() {
    }
    Start() {
    }
    Update() {
    }
    OnDestroy() {
    }
    // OnCollisionEnter2D(otherCollider) {
    // }
    // OnCollisionStay2D(otherCollider) {
    // }
    // OnCollisionExit2D(otherCollider) {
    // }

    // StartCoroutine(enumerator:any) {
    //     const cor = new Coroutine(enumerator);
    //     this.coroutines.push(cor);
    //     return cor;
    // }
    // StopCoroutine(coroutine) {
    //     this.coroutines.remove(coroutine);
    // }
    // StopAllCoroutines() {
    //     this.coroutines.clear();
    // }

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