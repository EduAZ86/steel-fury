
export interface keys {
    arrowLeft: boolean;
    arrowRight: boolean;
    arrowUp: boolean;
    arrowDown: boolean;
    space: boolean;
    esc: boolean;
    enter: boolean;
    key1: boolean;
    key2: boolean;
    key3: boolean;
    key4: boolean;
}

export class ArrowSpaceEnterEscKeys {
    arrowLeft: boolean;
    arrowRight: boolean;
    arrowUp: boolean;
    arrowDown: boolean;
    space: boolean;
    esc: boolean;
    enter: boolean;
    key1: boolean;
    key2: boolean;
    key3: boolean;
    key4: boolean;
    private _trackingKeys: boolean;
    private _handleKeyDown: (event: KeyboardEvent) => void;
    private _handleKeyUp: (event: KeyboardEvent) => void;
    private keyMap: Record<string, keyof keys>;

    constructor() {
        this.arrowLeft = false;
        this.arrowRight = false;
        this.arrowUp = false;
        this.arrowDown = false;
        this.space = false;
        this.esc = false;
        this.enter = false;
        this.key1 = false;
        this.key2 = false;
        this.key3 = false;
        this.key4 = false;
        this._trackingKeys = false;
        this._handleKeyDown = this.onKeyDown.bind(this);
        this._handleKeyUp = this.onKeyUp.bind(this);
        this.keyMap = {
            'ArrowLeft': 'arrowLeft',
            'ArrowRight': 'arrowRight',
            'ArrowUp': 'arrowUp',
            'ArrowDown': 'arrowDown',
            'w': 'arrowUp',
            's': 'arrowDown',
            'a': 'arrowLeft',
            'd': 'arrowRight',
            ' ': 'space',
            'Escape': 'esc',
            'Enter': 'enter',
            '1': 'key1',
            '2': 'key2',
            '3': 'key3',
            '4': 'key4',
        };
    }

    public get keysStatus(): keys {
        return {
            arrowLeft: this.arrowLeft,
            arrowRight: this.arrowRight,
            arrowUp: this.arrowUp,
            arrowDown: this.arrowDown,
            space: this.space,
            esc: this.esc,
            enter: this.enter,
            key1: this.key1,
            key2: this.key2,
            key3: this.key3,
            key4: this.key4,
        };
    }

    private onKeyDown(event: KeyboardEvent): void {
        const prop = this.keyMap[event.key];
        if (prop) {
            this[prop] = true;
        }
    }

    private onKeyUp(event: KeyboardEvent): void {
        const prop = this.keyMap[event.key];
        if (prop) {
            this[prop] = false;
        }
    }

    public getKeys() {
        if (!this._trackingKeys) {
            document.addEventListener('keydown', this._handleKeyDown);
            document.addEventListener('keyup', this._handleKeyUp);
            this._trackingKeys = true;
        }
    }

    public stopTracking() {
        if (this._trackingKeys) {
            document.removeEventListener('keydown', this._handleKeyDown);
            document.removeEventListener('keyup', this._handleKeyUp);
            this._trackingKeys = false;
        }
    }

}
