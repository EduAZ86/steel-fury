import { GameObject } from "./gameObject";
import { RigidBody2D } from "./rigidBody2D";
import { Iposition, Isize, bodyType, magnitudes } from "./types";
import { Collision2D } from "../Collision2D/Collision2D";
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
    Update(newPosition?: Iposition, newScale?: Isize, newRotation?: number) {
        newPosition && this.gameObject.transform.updatePosition(newPosition);
        newScale && this.gameObject.transform.updateScale(newScale);
        newRotation && this.gameObject.transform.updateRotation(newRotation);
    }
    OnDestroy() {
        this.gameObject.Destroy()
    }
    OnCollisionEnter2D(otherCollider: GameObject[]) {
        otherCollider.forEach((collider) => {

            const collisions = new Collision2D(this.rigidBody.collisionShape, collider.rigidBody.collisionShape)
        })
    }

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
