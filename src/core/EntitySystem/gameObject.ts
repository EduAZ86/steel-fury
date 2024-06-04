import { Transform } from "./transform.class";

type componentsProvider = (obj: any) => void

export class GameObject {
    name: string;
    active: boolean;
    destroyed: boolean;
    components: any[];
    transform: Transform;
    constructor(name: string, transform: Transform, componentsProvider: componentsProvider) {
        this.active = true;
        this.components = [];
        this.name = name;
        this.transform = transform;
        this.destroyed = false;
    }
    get activeSelf() { return this.active };

    get getTransform() { return this.transform };

    get getDestroyed() { return this.destroyed };

    set SetActive(active: boolean) {
        if (active === this.active)
            return;
        this.active = active;
    }

    AddComponent(component: any) {
        this.components.push(component);
        this.InitializeComponent(component);
        return component;
    }

    RemoveComponent(component: any) {
        this.components.filter(c => c !== component);
    }
    GetComponent(classRef: any) {
        var obj = this.components.find(c => c instanceof classRef);
        return obj;
    }
    GetComponents() {
        return this.components;
    }

    InitializeComponent(component: any) {
        component.gameObject = this;
        component.Awake();
    }

    static Destroy(gameObject: GameObject) {
        gameObject.destroyed = true;
    }
}