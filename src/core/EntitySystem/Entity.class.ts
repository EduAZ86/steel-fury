// import { GameObject } from "./gameObject";



// export class Entity {
//     started: boolean;
//     coroutines: any[];
//     gameObject: GameObject;
//     constructor(gameObject: GameObject) {
//         this.started = false;
//         this.coroutines = [];
//         this.gameObject = gameObject;
//     }

//     get getTransform() { return this.gameObject.transform; }
//     ;
//     get getStarted() { return this.started; }
//     ;
//     Awake() {
//     }
//     Start() {
//     }
//     Update() {
//     }
//     OnDestroy() {
//     }
//     OnCollisionEnter2D(otherCollider) {
//     }
//     OnCollisionStay2D(otherCollider) {
//     }
//     OnCollisionExit2D(otherCollider) {
//     }
//     DrawGizmo(camera) {
//     }
//     StartCoroutine(enumerator) {
//         const cor = new Coroutine(enumerator);
//         this.coroutines.push(cor);
//         return cor;
//     }
//     StopCoroutine(coroutine) {
//         this.coroutines.remove(coroutine);
//     }
//     StopAllCoroutines() {
//         this.coroutines.clear();
//     }
//     AddComponent(component) {
//         return this.gameObject.AddComponent(component);
//     }
//     GetComponent(classRef) {
//         return this.gameObject.GetComponent(classRef);
//     }
//     GetComponents() {
//         return this.gameObject.GetComponents();
//     }
//     _CheckStart() {
//         this._started = true;
//     }
//     public RunUpdateCoroutines() {
//         if (this.coroutines.length == 0)
//             return;
//         this.coroutines.forEach(cor => {
//             cor._OnUpdate();
//             if (cor._ConditionFullfilled())
//                 cor._Next();
//         });
//         this.coroutines = this.coroutines.filter(c => !c.isFinished);
//     }
// }