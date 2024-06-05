import { Transform } from "./transform";

type componentsProvider = (obj: GameObject) => void

export class GameObject {
    name: string;
    active: boolean;
    destroyed: boolean;
    components: GameObject[];
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

    get GetComponents() {
        return this.components;
    }

    set SetActive(active: boolean) {
        if (active === this.active)
            return;
        this.active = active;
    }

    AddComponent(component: GameObject) {
        this.components.push(component);
        this.InitializeComponent(component);
        return component;
    }

    RemoveComponent(component: GameObject) {
        this.components.filter(c => c !== component);
    }


    InitializeComponent(component: GameObject) {
        component.active = true;

    }

    static Destroy(gameObject: GameObject) {
        gameObject.destroyed = true;
    }
}